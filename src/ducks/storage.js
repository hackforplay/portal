// @flow
import firebase from '../settings/firebase';

import type { Dispatch, GetStore } from './type';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'storage';

export type StorageType =
  | {|
      isAvailable: false,
      isUploading: boolean,
      isDownloading: boolean,
      isRemoving: boolean,
      isEmpty: boolean,
      path: string,
      promise?: Promise<void>
    |}
  | {|
      isAvailable: true,
      isUploading: false,
      isDownloading: false,
      isRemoving: false,
      isEmpty: false,
      path: string,
      url: string,
      promise?: Promise<void>
    |};

const UPLOAD = 'portal/storage/UPLOAD';
const DOWNLOAD = 'portal/storage/DOWNLOAD';
const REMOVE = 'portal/storage/REMOVE';
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
      type: typeof REMOVE,
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
          isRemoving: false,
          isEmpty: false,
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
          isRemoving: false,
          isEmpty: false,
          path: action.path,
          promise: action.promise
        }
      };
    case REMOVE:
      return {
        ...state,
        [action.path]: {
          isAvailable: false,
          isUploading: false,
          isDownloading: false,
          isRemoving: true,
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
          isRemoving: false,
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
          isRemoving: false,
          isEmpty: true,
          path: action.path
        }
      };
    default:
      return state;
  }
};

export const upload = (path: string): Action => ({
  type: UPLOAD,
  path
});

export const download = (path: string, promise: Promise<void>): Action => ({
  type: DOWNLOAD,
  path,
  promise
});

export const remove = (path: string): Action => ({
  type: REMOVE,
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
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const uploadBlob: uploadBlobType = (path, file) => async (
  dispatch,
  getStore
) => {
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
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const downloadUrl: downloadUrlType = path => async (
  dispatch,
  getStore
) => {
  const storage = getStorageByPath(getStore(), path);
  if (storage.isAvailable) {
    // すでにダウンロードされたファイル
    return;
  }
  if (storage.isDownloading) {
    // ダウンロード中
    return storage.promise;
  }

  try {
    const promise = firebase
      .storage()
      .ref()
      .child(path)
      .getDownloadURL();

    // ダウンロード開始
    dispatch(download(path, promise));

    const result = await promise;
    if (result) {
      // URL を格納
      await dispatch(set(path, result));
    } else {
      // フィールドが空だった
      await dispatch(empty(path));
    }
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      await dispatch(empty(path));
    } else {
      throw error;
    }
  }
};

export type moveFileType = (
  prevPath: string,
  nextPath: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const moveFile: moveFileType = (prevPath, nextPath) => async (
  dispatch,
  getStore
) => {
  if (prevPath === nextPath) {
    // 移動先のパスと同じ (何もしなくていい)
    return;
  }
  // 1. prevPath からファイルをダウンロード
  const prev = getStorageByPath(getStore(), prevPath);
  if (prev.isDownloading || prev.isEmpty) {
    // ダウンロード中またはファイルが存在しない
    // TODO: 本当は Downloading が終わるまで待つべき
    throw new Error(`Failed to moveFile: ${prevPath} is not found`);
  }
  if (!prev.url) {
    // URL を取得して再挑戦
    await dispatch(downloadUrl(prevPath));
    // ===> Store が更新される
    return dispatch(moveFile(prevPath, nextPath));
  }
  const response = await fetch(prev.url);
  const file = await response.blob();

  // 2. nextPath に同じファイルをアップロード
  await dispatch(uploadBlob(nextPath, file));

  const next = getStorageByPath(getStore(), nextPath);
  if (!next.url) {
    // アップロードに失敗した
    return;
  }

  // 3. prevPath からファイルを削除
  await firebase
    .storage()
    .ref(prevPath)
    .delete();
  dispatch(empty(prevPath));
};

export type removeFileType = (
  path: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const removeFile: removeFileType = path => async (
  dispatch,
  getStore
) => {
  const storage = getStorageByPath(getStore(), path);
  if (storage.isRemoving || storage.isEmpty) {
    // すでに削除中か、削除済み
    return;
  }
  dispatch(remove(path));

  await firebase
    .storage()
    .ref(path)
    .delete();

  dispatch(empty(path));
};

export function getStorageByPath(
  store: $Call<GetStore>,
  path?: string
): StorageType {
  return (
    (path && getState(store)[path]) || {
      isAvailable: false,
      isUploading: false,
      isDownloading: false,
      isRemoving: false,
      isEmpty: false,
      path: ''
    }
  );
}

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
