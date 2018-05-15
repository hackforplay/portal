import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export * from './elasticsearch';
export * from './work';

admin.initializeApp();

const users = admin.firestore().collection('users');

type UserDocumentData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  worksNum: number;
  createdAt: string;
};

export const addUserDocument = functions.auth
  .user()
  .onCreate((handler, context) => {
    // ユーザーが初めて OAuth 認証を行った時、Firestore に新しいドキュメントを追加する

    const data: UserDocumentData = {
      uid: handler.uid,
      displayName: 'guest',
      email: handler.email, // いずれ非公開情報にする
      photoURL: handler.photoURL,
      worksNum: 0,
      createdAt: context.timestamp
    };

    return users.doc(handler.uid).create(data);
  });
