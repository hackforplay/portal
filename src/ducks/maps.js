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

type MapDocument = {
  jsonRef: string,
  jsonUrl: string,
  thumbnailStoragePath: string,
  uid: string,
  visibility: 'public'
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
    Error>)
};

export type State = {
  isUploading: boolean,
  byPath: {
    [key: string]: MapDocumentState
  },
  dataByPath: {
    [key: string]: MapDataState
  }
};

const initialState: State = {
  isUploading: false,
  byPath: {},
  dataByPath: {}
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
    const thumbnailStoragePath = `image/public/users/${uid}/${uuid()}.${ext}`;

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

    const _ = await firebase
      .firestore()
      .collection('maps')
      .add({
        uid,
        visibility: 'public',
        jsonRef: `gs://${snapshot.metadata.bucket}/${
          snapshot.metadata.fullPath
        }`,
        jsonUrl: `https://storage.googleapis.com/${snapshot.metadata.bucket}/${
          snapshot.metadata.fullPath
        }`,
        thumbnailStoragePath
      });
    const documentRef = ((_: any): $npm$firebase$firestore$DocumentReference);

    const result = {
      id: documentRef.id
    };
    dispatch(actions.createNew.done({ params, result }));

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

  if (byPath[path] || dataByPath[path]) {
    return; // 既にロード中
  }

  const params = { path };
  dispatch(actions.load.started(params));

  try {
    // Firestore から取得
    const documentSnapshot = await firebase
      .firestore()
      .doc(path)
      .get();

    const documentData = ((documentSnapshot.data(): any): MapDocument);

    const response = await fetch(documentData.jsonUrl);
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

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
