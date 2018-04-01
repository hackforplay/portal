// @flow
import firebase from 'firebase';

import { isAuthUser } from './auth';
import type { Dispatch, GetState } from './';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'storage';

export type StorageType =
  | {|
      isAvailable: false,
      isUploading: boolean,
      isDownloading: boolean,
      isRemoving: boolean,
      isEmpty: boolean,
      path: string
    |}
  | {|
      isAvailable: true,
      isUploading: false,
      isDownloading: false,
      isRemoving: false,
      isEmpty: false,
      path: string,
      url: string
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
          path: action.path
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

export const download = (path: string): Action => ({
  type: DOWNLOAD,
  path
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
  const parsed = parseStoragePath(path);
  if (!isAuthUser(getState(), parsed.uid)) {
    // アップロード権限がない
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
  const parsed = parseStoragePath(path);
  if (!isAuthUser(getState(), parsed.uid) && parsed.visibility === 'private') {
    // ダウンロード権限がない
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
      await dispatch(set(path, result));
    } else {
      // フィールドが空だった
      await dispatch(empty(path));
    }
  } catch (error) {
    // 何らかのエラー => 空とみなす
    await dispatch(empty(path));
    console.error(error);
  }
};

export type moveFileType = (
  prevPath: string,
  nextPath: string
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const moveFile: moveFileType = (prevPath, nextPath) => async (
  dispatch,
  getState
) => {
  if (prevPath === nextPath) {
    // 移動先のパスと同じ (何もしなくていい)
    return;
  }
  // 1. prevPath からファイルをダウンロード
  const prev = getStorageByPath(getState(), prevPath);
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

  const next = getStorageByPath(getState(), nextPath);
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
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const removeFile: removeFileType = path => async (
  dispatch,
  getState
) => {
  const storage = getStorageByPath(getState(), path);
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
  state: $Call<GetState>,
  path: string
): StorageType {
  return (
    state.storage[path] || {
      isAvailable: false,
      isUploading: false,
      isDownloading: false,
      isRemoving: false,
      isEmpty: false,
      path
    }
  );
}

export function parseStoragePath(path: string) {
  const [container, visibility, _users, uid, fileName] = path.split('/');
  const [hash, extention] = fileName.split('.');
  const error = new ParseError(path);
  if (!['image', 'images', 'json'].includes(container)) {
    error.add('container', container);
  }
  if (!['public', 'limited', 'private'].includes(visibility)) {
    error.add('visibility', visibility);
  }
  if (_users !== 'users') {
    error.add('"users"', _users);
  }
  if (!uid) {
    error.add('uid', uid);
  }
  if (!hash) {
    error.add('hash', hash);
  }
  if (!extention) {
    error.add('extension', extention);
  }
  if (error.has()) {
    throw error;
  }
  return {
    container,
    visibility,
    uid,
    fileName,
    hash,
    extention
  };
}

class ParseError extends Error {
  path: string;
  message: string = '';

  constructor(path: string) {
    super();
    this.path = path;
  }

  add = (name, value) => {
    this.message += `There is an invalid ${name}, ${value}.`;
  };

  has = () => {
    return !!this.message;
  };
}
