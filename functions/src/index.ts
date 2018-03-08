import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export * from './elasticsearch';
export * from './work';

admin.initializeApp(functions.config().firebase);

const users = admin.firestore().collection('users');

type UserDocumentData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  worksNum: number;
  createdAt: string;
};

export const addUserDocument = functions.auth.user().onCreate(event => {
  // ユーザーが初めて OAuth 認証を行った時、Firestore に新しいドキュメントを追加する
  const user = event.data;

  const data: UserDocumentData = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email, // いずれ非公開情報にする
    photoURL: user.photoURL,
    worksNum: 0,
    createdAt: event.timestamp
  };

  return users.doc(user.uid).create(data);
});
