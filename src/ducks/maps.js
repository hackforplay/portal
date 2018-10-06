// @flow
import firebase from 'firebase';
import 'firebase/firestore';
import mime from 'mime-types';
import uuid from 'uuid/v4';
import {
  actionCreatorFactory,
  type ActionCreator,
  type AsyncActionCreators
} from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { Statefull } from './helpers';
import * as helpers from './helpers';
import { uploadBlob } from './storage';
import * as authImport from './auth';
import type { Dispatch, GetStore } from './type';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'maps';

// redux-thunk and flow-type compat
export type Action = {};

export type MapDocument = {
  jsonRef: string,
  jsonUrl: string,
  thumbnailStoragePath: string,
  uid: string,
  visibility: 'limited',
  createdAt: FirestoreTimestamp,
  updatedAt?: FirestoreTimestamp
};
export type MapDocumentState = Statefull<MapDocument>;

type MapData = {
  tables: any[],
  squares: any[]
};
export type MapDataState = Statefull<MapData>;

const actionCreator = actionCreatorFactory('portal/maps');
export const actions = {
  set: (actionCreator('SET'): ActionCreator<{
    path: string,
    data: MapData
  }>),
  load: (actionCreator.async('LOAD'): AsyncActionCreators<{ path: string },
    {
      path: string,
      data: MapData,
      documentData: MapDocument
    },
    Error>),
  createNew: (actionCreator.async('CREATE_NEW'): AsyncActionCreators<{ json: string, thumbnailDataURL: string },
    {},
    Error>),
  update: (actionCreator.async('UPDATE'): AsyncActionCreators<{
      json: string,
      thumbnailDataURL: string,
      path: string
    },
    {},
    Error>),
  bringOwnDocumentTop: (actionCreator('BRING_OWN_DOCUMENT_TOP'): ActionCreator<{
    document: $npm$firebase$firestore$DocumentSnapshot
  }>),
  loadOwnDocuments: (actionCreator.async(
    'LOAD_OWN_DOCUMENTS'
  ): AsyncActionCreators<{},
    {
      documents: $npm$firebase$firestore$DocumentSnapshot[]
    },
    Error>)
};

export type State = {
  isUploading: boolean,
  byPath: {
    [key: string]: MapDocumentState
  },
  dataByPath: {
    [key: string]: MapDataState
  },
  ownDocumentSnapshotsOrderByUpdatedAt: $npm$firebase$firestore$DocumentSnapshot[]
};

const initialState: State = {
  isUploading: false,
  byPath: {},
  dataByPath: {},
  ownDocumentSnapshotsOrderByUpdatedAt: []
};

// Root Reducer
export default reducerWithInitialState(initialState)
  .cases(
    [actions.createNew.started, actions.update.started],
    (state, files) => {
      const next: State = {
        ...state,
        isUploading: true
      };
      return next;
    }
  )
  .cases(
    [
      actions.createNew.done,
      actions.createNew.failed,
      actions.update.done,
      actions.update.failed
    ],
    (state, files) => {
      const next: State = {
        ...state,
        isUploading: false
      };
      return next;
    }
  )
  .case(actions.load.done, (state, payload) => {
    const next: State = {
      ...state,
      byPath: {
        ...state.byPath,
        [payload.params.path]: helpers.has(payload.result.documentData)
      },
      dataByPath: {
        ...state.dataByPath,
        [payload.params.path]: helpers.has(payload.result.data)
      }
    };
    return next;
  })
  .case(actions.set, (state, payload) => {
    const next: State = {
      ...state,
      dataByPath: {
        ...state.dataByPath,
        [payload.path]: helpers.has(payload.data)
      }
    };
    return next;
  })
  .case(actions.bringOwnDocumentTop, (state, payload) => {
    // ownDocumentSnapshotsOrderByUpdatedAt のトップを payload.document に変更または新たに追加する
    const document: $npm$firebase$firestore$DocumentSnapshot = payload.document;
    const snapshots = state.ownDocumentSnapshotsOrderByUpdatedAt.filter(
      old => old.id !== document.id
    );
    snapshots.unshift(document);
    const next: State = {
      ...state,
      ownDocumentSnapshotsOrderByUpdatedAt: snapshots
    };
    return next;
  })
  .case(actions.loadOwnDocuments.done, (state, payload) => {
    // ownDocumentSnapshotsOrderByUpdatedAt に payload.documents を追加し, タイムスタンプでソートする
    const documents: $npm$firebase$firestore$DocumentSnapshot[] =
      payload.result.documents;
    const byPath = { ...state.byPath };
    for (const item of documents) {
      byPath[`maps/${item.id}`] = helpers.has(item.data());
    }
    const snapshots = [...state.ownDocumentSnapshotsOrderByUpdatedAt];
    for (const item of documents) {
      const index = snapshots.findIndex(old => old.id === item.id);
      if (index !== -1) {
        snapshots[index] = item;
      } else {
        snapshots.push(item);
      }
    }
    snapshots.sort(compareTimestamps);
    const next: State = {
      ...state,
      byPath,
      ownDocumentSnapshotsOrderByUpdatedAt: snapshots
    };
    return next;
  });

export type SaveNewMapJson = (
  json: string,
  thumbnailDataURL: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<string>;

export const saveNewMapJson: SaveNewMapJson = (
  json,
  thumbnailDataURL
) => async (dispatch, getStore) => {
  const { uid } = authImport.getState(getStore()).user || { uid: '' };
  const { isUploading } = getState(getStore());

  if (!uid) return '';

  const params = { json, thumbnailDataURL };

  if (isUploading) return '';
  dispatch(actions.createNew.started(params));

  try {
    // thumbnail のアップロード
    // data url => base64 string and metadata
    const [param, base64] = thumbnailDataURL.split(',');
    const regex = /^data:(.*);base64$/i.exec(param); // e.g. data:image/jpeg;base64
    if (!regex) {
      throw new Error(`Invalid Data URL: ${param},...`);
    }
    const type = regex[1];
    const ext = mime.extension(type);
    if (!base64 || !type || !ext) {
      throw new Error(`Invalid Data URL: ${param},...`);
    }
    // base64 string => blob ==[UPLOAD]==> storage path
    const bin = atob(base64); // base64 encoded string => binary string
    let byteArray = new Uint8Array(bin.length); // binary string => 8bit TypedArray
    for (let i = bin.length - 1; i >= 0; i--) {
      byteArray[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([byteArray.buffer], { type });
    const thumbnailStoragePath = `image/limited/users/${uid}/${uuid()}.${ext}`;

    // Upload to storage
    await dispatch(uploadBlob(thumbnailStoragePath, blob));

    // マップデータ JSON に書き出し
    const file = new Blob([json], { type: 'application/json' });

    // Storage にアップロード
    const snapshot = await firebase
      .storage()
      .refFromURL(
        `gs://${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_UGC ||
          ''}/${uuid()}.json`
      )
      .put(file);

    const _: any = await firebase
      .firestore()
      .collection('maps')
      .add({
        uid,
        visibility: 'limited',
        jsonRef: `gs://${snapshot.metadata.bucket}/${
          snapshot.metadata.fullPath
        }`,
        jsonUrl: `https://storage.googleapis.com/${snapshot.metadata.bucket}/${
          snapshot.metadata.fullPath
        }`,
        thumbnailStoragePath,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

    dispatch(actions.createNew.done({ params, result: {} }));

    // ストアの情報を更新する
    const documentRef = (_: $npm$firebase$firestore$DocumentReference);
    const documentSnapshot: $npm$firebase$firestore$DocumentSnapshot = await documentRef.get();
    dispatch(actions.bringOwnDocumentTop({ document: documentSnapshot }));

    return documentRef.id; // ストアにreact-router-domの状態を入れて、リダイレクトが出来るようにする
  } catch (error) {
    dispatch(actions.createNew.failed({ params, error }));
    console.error(error);
  }
  return '';
};

export type UpdateMapJson = (
  json: string,
  thumbnailDataURL: string,
  path: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const updateMapJson: UpdateMapJson = (
  json,
  thumbnailDataURL,
  path
) => async (dispatch, getStore) => {
  const { uid } = authImport.getState(getStore()).user || { uid: '' };
  const { isUploading, byPath } = getState(getStore());
  const documentData = byPath[path].data;

  if (!uid || !path || !documentData) return;

  const params = { json, thumbnailDataURL, path };

  if (isUploading) return;
  dispatch(actions.update.started(params));

  try {
    // ストアのデータを更新する
    const data = JSON.parse(json);
    dispatch(actions.set({ path, data }));

    // ストアのドキュメントが更新されたら、ドキュメントをトップに持ってくる
    const cancel = await firebase
      .firestore()
      .doc(path)
      .onSnapshot(documentSnapshot => {
        cancel();
        dispatch(actions.bringOwnDocumentTop({ document: documentSnapshot }));
      });

    // thumbnail のアップロード
    // data url => base64 string and metadata
    const [param, base64] = thumbnailDataURL.split(',');
    const result = /^data:(.*);base64$/i.exec(param); // e.g. data:image/jpeg;base64
    if (!result) {
      throw new Error(`Invalid Data URL: ${param},...`);
    }
    const type = result[1];
    const ext = mime.extension(type);
    if (!base64 || !type || !ext) {
      throw new Error(`Invalid Data URL: ${param},...`);
    }
    // base64 string => blob ==[UPLOAD]==> storage path
    const bin = atob(base64); // base64 encoded string => binary string
    let byteArray = new Uint8Array(bin.length); // binary string => 8bit TypedArray
    for (let i = bin.length - 1; i >= 0; i--) {
      byteArray[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([byteArray.buffer], { type });

    // Upload to storage
    await dispatch(uploadBlob(documentData.thumbnailStoragePath, blob));

    // マップデータ JSON に書き出し
    const file = new Blob([json], { type: 'application/json' });
    // Storage にアップロード
    await firebase
      .storage()
      .refFromURL(documentData.jsonRef)
      .put(file);

    await firebase
      .firestore()
      .doc(path)
      .update({
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    dispatch(actions.update.done({ params, result: {} }));
  } catch (error) {
    dispatch(actions.update.failed({ params, error }));
    console.error(error);
  }
};

export type LoadMap = (
  path: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const loadMap: LoadMap = path => async (dispatch, getStore) => {
  const { byPath, dataByPath } = getState(getStore());

  if (dataByPath[path]) return; // 既にロード中

  const params = { path };
  dispatch(actions.load.started(params));

  try {
    let documentData = byPath[path] ? byPath[path].data : null;
    let jsonUrl;
    if (documentData) {
      jsonUrl = documentData.jsonUrl;
    } else {
      // Firestore から取得
      const documentSnapshot = await await firebase
        .firestore()
        .doc(path)
        .get();

      documentData = ((documentSnapshot.data(): any): MapDocument);
      jsonUrl = documentData.jsonUrl;
    }

    const response = await fetch(jsonUrl);
    const json = await response.text();
    const result = {
      path,
      data: JSON.parse(json),
      documentData
    };

    dispatch(actions.load.done({ params, result }));
  } catch (error) {
    console.error(error);
    dispatch(actions.load.failed({ params, error }));
  }
};

export type LoadOwnMaps = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const loadOwnMaps: LoadOwnMaps = () => async (dispatch, getStore) => {
  const authUser = authImport.getState(getStore()).user;
  if (!authUser) {
    // ログインしていない
    return;
  }
  const params = {};
  dispatch(actions.loadOwnDocuments.started(params));
  try {
    const { uid } = authUser;
    const querySnapshot = await firebase
      .firestore()
      .collection('maps')
      .where('uid', '==', uid)
      .orderBy('updatedAt', 'desc')
      .orderBy('createdAt', 'desc')
      .get();
    const result = {
      documents: querySnapshot.docs
    };
    dispatch(actions.loadOwnDocuments.done({ params, result }));
  } catch (error) {
    dispatch(actions.loadOwnDocuments.failed({ params, error }));
  }
};

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}

function compareTimestamps(
  a: $npm$firebase$firestore$DocumentSnapshot,
  b: $npm$firebase$firestore$DocumentSnapshot
): number {
  const _a: MapDocument = (a.data(): any);
  const _b: MapDocument = (b.data(): any);
  const aTimestamp = _a.updatedAt || _a.createdAt;
  const bTimestamp = _b.updatedAt || _b.createdAt;
  return bTimestamp.toDate().getTime() - aTimestamp.toDate().getTime();
}
