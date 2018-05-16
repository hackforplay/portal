import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as request from 'request-promise';
import * as _ from 'lodash';

// Refferer: https://medium.com/joolsoftware/extending-firebase-with-cloud-functions-elasticsearch-129fbbb951e0

const elasticsearchFields = [
  'uid',
  'title',
  'description',
  'visibility',
  'author',
  'createdAt'
];

export const indexWorksToElastic = functions.firestore
  .document('/works/{workId}')
  .onWrite((data, context) => {
    console.log(data);

    // event.data と event.previous を比較して、インデックス対象のフィールドが変化していたときのみアップデート
    const workData = data.after.data();
    const specificData = _.pick(workData, elasticsearchFields);
    const previousData = data.before.data();

    if (
      previousData &&
      _.isEqual(specificData, _.pick(previousData, elasticsearchFields))
    ) {
      // previous が存在し、かつ elasticsearchFields のフィールド値が更新されていない
      return Promise.resolve();
    }
    if (!previousData && workData.visibility !== 'public') {
      // はじめて追加されたデータで、かつ検索できないデータに設定されている
      return Promise.resolve();
    }

    const { workId } = context.params;

    const elasticSearchConfig = functions.config().elasticsearch;
    const elasticsearchRequest = {
      method: 'POST',
      uri: `${elasticSearchConfig.url}works/work/${workId}`,
      auth: {
        username: elasticSearchConfig.username,
        password: elasticSearchConfig.password
      },
      body: specificData,
      json: true
    };

    if (
      !workData ||
      (previousData.visibility === 'public' && workData.visibility !== 'public')
    ) {
      // データが削除されたか、検索できないデータに設定された
      elasticsearchRequest.method = 'DELETE';
      elasticsearchRequest.body = {};
      console.log('Remove index ', workId, workData);
    } else {
      console.log('Indexing work ', workId, workData);
    }

    return request(elasticsearchRequest).then(response => {
      console.log('Elasticsearch response', response);
    });
  });

const app = express();
app.use(cors());

app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.post('/works/work', async (req, res) => {
  // Elasticsearch で検索
  const elasticSearchConfig = functions.config().elasticsearch;
  const elasticSearchUrl = elasticSearchConfig.url + 'works/work/_search';
  const elasticSearchMethod = 'POST';
  const elasticsearchRequest = {
    method: elasticSearchMethod,
    uri: elasticSearchUrl,
    auth: {
      username: elasticSearchConfig.username,
      password: elasticSearchConfig.password
    },
    body: req.body,
    json: true
  };
  console.log('request', elasticsearchRequest);
  const elasticsearchResponse = await request(elasticsearchRequest);
  console.log('search response', elasticsearchResponse);
  console.log('iterator', elasticsearchResponse.hits.hits[Symbol.iterator]);

  const works = [];
  for (const item of elasticsearchResponse.hits.hits) {
    if (item._source.visibility !== 'public') {
      console.log('this item is invisible!');
      continue;
    }
    // Firestore からデータを取得
    const snapshot = await admin
      .firestore()
      .collection('works')
      .doc(item._id)
      .get();
    console.log(snapshot);
    if (snapshot.exists) {
      const work = {
        ...snapshot.data(),
        id: snapshot.id,
        path: `/works/${snapshot.id}`
      };
      works.push(work);
    }
  }
  return res.json({
    version: 0,
    works
  });
});

export const elasticsearch = functions.https.onRequest(app);
// export default functions.https.onRequest((req, res) => {
//   console.log('pre', req.path, req.url);
//   if (!req.path) {
//     // prepending "/" keeps query params, path params intact
//     req.url = `/${req.url}`;
//   }
//   return app(req, res);
// });
