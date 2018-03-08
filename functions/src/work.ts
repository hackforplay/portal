import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// TODO: 分散カウンタ
// https://firebase.google.com/docs/firestore/solutions/counters?hl=ja

export const incrementViewsCount = functions.firestore
  .document('/works/{workId}/views/{viewId}')
  .onCreate(event => {
    // views コレクションに新しいドキュメントが追加されたら、 viewsCount をインクリメントする
    const { workId } = event.params;

    const workRef = admin.firestore().doc(`/works/${workId}`);

    return admin.firestore().runTransaction(async t => {
      const doc = await t.get(workRef);
      const viewsNum = doc.data().viewsNum + 1;
      t.update(workRef, { viewsNum });
    });
  });

export const decrementViewsCount = functions.firestore
  .document('/works/{workId}/views/{viewId}')
  .onDelete(event => {
    // views コレクションからドキュメントが削除されたら、 viewsCount をデクリメントする
    const { workId } = event.params;

    const workRef = admin.firestore().doc(`/works/${workId}`);

    return admin.firestore().runTransaction(async t => {
      const doc = await t.get(workRef);
      const viewsNum = doc.data().viewsNum - 1;
      t.update(workRef, { viewsNum });
    });
  });
