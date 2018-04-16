import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// TODO: 分散カウンタ
// https://firebase.google.com/docs/firestore/solutions/counters?hl=ja

export const incrementViewsCount = functions.firestore
  .document('/works/{workId}/views/{viewId}')
  .onCreate(async event => {
    const { workId, viewId } = event.params;
    const { uid, createdAt } = event.data.data();
    // もしログインユーザーなら、 users.histories (履歴) に追加する
    if (uid) {
      await admin
        .firestore()
        .collection(`/users/${uid}/histories`)
        .add({
          viewId,
          workId,
          createdAt
        });
    }
    // views コレクションに新しいドキュメントが追加されたら、 viewsCount をインクリメントする

    const workRef = admin.firestore().doc(`/works/${workId}`);

    await admin.firestore().runTransaction(async t => {
      const doc = await t.get(workRef);
      if (doc.exists) {
        const viewsNum = doc.data().viewsNum + 1;
        t.update(workRef, { viewsNum });
      }
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
      if (doc.exists) {
        const viewsNum = doc.data().viewsNum - 1;
        t.update(workRef, { viewsNum });
      }
    });
  });

export const calcurateClearRate = functions.firestore
  .document('/works/{workId}/views/{viewId}')
  .onUpdate(event => {
    // views コレクションの labels が変更されたら,
    // 直近の views を使って cleared / all を計算する
    const { workId } = event.params;

    const workRef = admin.firestore().doc(`/works/${workId}`);

    return admin.firestore().runTransaction(async t => {
      const doc = await t.get(workRef);
      if (doc.exists) {
        // 全部は計算できないので直近のドキュメントだけ...
        // TODO: 毎回フェッチしなくても良い計算方法にする
        const viewsSnapShot = await workRef
          .collection('views')
          .orderBy('createdAt', 'desc')
          .limit(20)
          .get();
        const all = viewsSnapShot.size;
        const cleared = viewsSnapShot.docs.filter(
          snapshot => snapshot.get('labels.gameclear') === 'gameclear'
        ).length;
        const clearRate = cleared / all;

        t.update(workRef, { clearRate });
      }
    });
  });
