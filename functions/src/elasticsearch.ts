import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as request from 'request-promise';
import * as _ from 'lodash';

// Refferer: https://medium.com/joolsoftware/extending-firebase-with-cloud-functions-elasticsearch-129fbbb951e0

export const indexWorksToElastic = functions.firestore
  .document('/works/{workId}')
  .onWrite(event => {
    console.log(event.data);
    const workData = event.data.data();
    const workId = event.data.id;
    console.log('Indexing work ', workId, workData);
    const elasticsearchFields = ['uid', 'title', 'description', 'visibility', 'author', 'createdAt'];
    const elasticSearchConfig = functions.config().elasticsearch;
    const elasticSearchUrl = elasticSearchConfig.url + 'works/work/' + workId;
    const elasticSearchMethod = workData ? 'POST' : 'DELETE';
    const elasticsearchRequest = {
      method: elasticSearchMethod,
      uri: elasticSearchUrl,
      auth: {
        username: elasticSearchConfig.username,
        password: elasticSearchConfig.password
      },
      body: _.pick(workData, elasticsearchFields),
      json: true
    };
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
