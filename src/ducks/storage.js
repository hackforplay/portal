// @flow

import firebase from 'firebase';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'storage';

export type StorageType =
  | {
      isAvailable: false,
      isUploading: boolean,
      isDownloading: boolean,
      isEmpty: boolean,
      path: string
    }
  | {
      isAvailable: true,
      isUploading: false,
      isDownloading: false,
      isEmpty: false,
      path: string,
      url: string
    };

const UPLOAD = 'portal/storage/UPLOAD';
const DOWNLOAD = 'portal/storage/DOWNLOAD';
const SET = 'portal/storage/SET';
const EMPTY = 'portal/storage/EMPTY';

type ActionType =
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

export default (state: State = initialState, action: ActionType): State => {
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

export const upload = (path: string): ActionType => ({
  type: DOWNLOAD,
  path
});

export const download = (path: string): ActionType => ({
  type: DOWNLOAD,
  path
});

export const set = (path: string, url: string): ActionType => ({
  type: SET,
  path,
  url
});

export const empty = (path: string): ActionType => ({
  type: EMPTY,
  path
});

export const uploadBlob = (path: string, file: Blob) => async (
  dispatch,
  getState: () => { storage: State }
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

export const downloadUrl = (path: string) => async (
  dispatch,
  getState: () => { storage: State }
) => {
  const storage = getStorageByPath(getState(), path);
  if (storage.isAvailable || storage.isDownloading) {
    // すでにダウンロードされたファイル
    return;
  }

  // ダウンロード開始
  dispatch(download(path));
  const result = await firebase
    .storage()
    .ref()
    .child(path)
    .getDownloadURL();
  dispatch(set(path, result));
};

export function getStorageByPath(
  state: { storage: State },
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
