// @flow
import firebase from 'firebase';
import 'firebase/firestore';
import mime from 'mime-types';
import uuid from 'uuid/v4';
import { actionCreatorFactory } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { Statefull } from './helpers';
import { uploadBlob } from './storage';
import * as authImport from './auth';
import type { Dispatch, GetStore } from './type';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'maps';

const actionCreator = actionCreatorFactory('portal/maps');
export const actions = {
  createNew: actionCreator.async('CREATE_NEW')
};

// redux-thunk and flow-type compat
export type Action = {};

type MapDocument = {
  jsonStoragePath: string,
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
  .case(actions.createNew.started, (state, files) => {
    const next: State = {
      ...state,
      isUploading: true
    };
    return next;
  })
  .cases([actions.createNew.done, actions.createNew.failed], (state, files) => {
    const next: State = {
      ...state,
      isUploading: false
    };
    return next;
  });

export type SaveNewMapJson = (
  json: string,
  thumbnailDataURL: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const saveNewMapJson: SaveNewMapJson = (
  json,
  thumbnailDataURL
) => async (dispatch, getStore) => {
  const { uid } = authImport.getState(getStore()).user || { uid: '' };
  const { isUploading } = getState(getStore());

  if (!uid) return;

  const params = { json, thumbnailDataURL };

  if (isUploading) return;
  dispatch(actions.createNew.started({ params }));

  try {
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
    const thumbnailStoragePath = `image/public/users/${uid}/${uuid()}.${ext}`;

    // Upload to storage
    await dispatch(uploadBlob(thumbnailStoragePath, blob));

    // マップデータ JSON に書き出し
    const file = new Blob([json], { type: 'application/json' });
    // Storage にアップロード
    const jsonStoragePath = `json/public/users/${uid}/${uuid()}.json`;
    await dispatch(uploadBlob(jsonStoragePath, file));

    const ref = await firebase
      .firestore()
      .collection('maps')
      .add({
        uid,
        visibility: 'public',
        jsonStoragePath,
        thumbnailStoragePath
      });

    console.log(ref);

    dispatch(actions.createNew.done({ params, result: {} }));
  } catch (error) {
    dispatch(actions.createNew.failed({ params, error }));
    console.error(error);
  }
};

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
