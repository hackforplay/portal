// @flow
import firebase from 'firebase';

import type { Dispatch, GetState } from './';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'storage';

export type StorageType =
  | {|
      isAvailable: false,
      isUploading: boolean,
      isDownloading: boolean,
      isEmpty: boolean,
      path: string
    |}
  | {|
      isAvailable: true,
      isUploading: false,
      isDownloading: false,
      isEmpty: false,
      path: string,
      url: string
    |};

const UPLOAD = 'portal/storage/UPLOAD';
const DOWNLOAD = 'portal/storage/DOWNLOAD';
const SET = 'portal/storage/SET';
const EMPTY = 'portal/storage/EMPTY';

export type Action =
  | {
      type: typeof UPLOAD,
      path: string
    }
  | {
      type: typeof DOWNLOAD,
      path: string
    }
  | {
      type: typeof SET,
      path: string,
      url: string
    }
  | {
      type: typeof EMPTY,
      path: string
    };

export type State = {
  [string]: StorageType
};

const initialState: State = {};

// Reducers

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case UPLOAD:
      return {
        ...state,
        [action.path]: {
          isAvailable: false,
          isUploading: true,
          isDownloading: false,
          isEmpty: true,
          path: action.path
        }
      };
    case DOWNLOAD:
      return {
        ...state,
        [action.path]: {
          isAvailable: false,
          isUploading: false,
          isDownloading: true,
          isEmpty: false,
          path: action.path
        }
      };
    case SET:
      return {
        ...state,
        [action.path]: {
          isAvailable: true,
          isUploading: false,
          isDownloading: false,
          isEmpty: false,
          path: action.path,
          url: action.url
        }
      };
    case EMPTY:
      return {
        ...state,
        [action.path]: {
          isAvailable: false,
          isUploading: false,
          isDownloading: false,
          isEmpty: true,
          path: action.path
        }
      };
    default:
      return state;
  }
};

export const upload = (path: string): Action => ({
  type: DOWNLOAD,
  path
});

export const download = (path: string): Action => ({
  type: DOWNLOAD,
  path
});

export const set = (path: string, url: string): Action => ({
  type: SET,
  path,
  url
});

export const empty = (path: string): Action => ({
  type: EMPTY,
  path
});

export type uploadBlobType = (
  path: string,
  file: Blob
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const uploadBlob: uploadBlobType = (path, file) => async (
  dispatch,
  getState
) => {
  const storage = getStorageByPath(getState(), path);
  if (storage.isAvailable || storage.isUploading) {
    // すでにアップロードされたファイル
    return;
  }

  // アップロード開始
  dispatch(upload(path));
  const result = await firebase
    .storage()
    .ref()
    .child(path)
    .put(file);
  if (result.downloadURL) {
    // downloadURL をセット
    dispatch(set(path, result.downloadURL));
  }
};

export type downloadUrlType = (
  path: string
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const downloadUrl: downloadUrlType = path => async (
  dispatch,
  getState
) => {
  const storage = getStorageByPath(getState(), path);
  if (storage.isAvailable || storage.isDownloading) {
    // すでにダウンロードされたファイル
    return;
  }

  // ダウンロード開始
  dispatch(download(path));
  try {
    const result = await firebase
      .storage()
      .ref()
      .child(path)
      .getDownloadURL();
    if (result) {
      // URL を格納
      dispatch(set(path, result));
    } else {
      // フィールドが空だった
      dispatch(empty(path));
    }
  } catch (error) {
    // 何らかのエラー => 空とみなす
    dispatch(empty(path));
    console.error(error);
  }
    .storage()
    .ref()
    .child(path)
    .getDownloadURL();
  dispatch(set(path, result));
};

export function getStorageByPath(
  state: $Call<GetState>,
  path: string
): StorageType {
  return (
    state.storage[path] || {
      isAvailable: false,
      isUploading: false,
      isDownloading: false,
      isEmpty: false,
      path
    }
  );
}
