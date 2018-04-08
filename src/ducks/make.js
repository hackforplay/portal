// @flow
import firebase from 'firebase';
import 'firebase/firestore';
import md5 from 'md5';
import mime from 'mime-types';
import uuid from 'uuid/v4';

import * as helpers from './helpers';
import {
  downloadUrl,
  uploadBlob,
  getStorageByPath,
  moveFile,
  removeFile,
  parseStoragePath
} from './storage';
import { getUserByUid } from './user';
import { empty } from './work';
import type { Dispatch, GetState } from './';
import type { WorkItemType, WorkData, VisibilityType } from './work';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'make';

const CREATE = 'portal/make/CREATE';
const CHANGE = 'portal/make/CHANGE';
const METADATA = 'portal/make/METADATA';
const THUMBNAIL = 'portal/make/THUMBNAIL';
const TRASH = 'portal/make/TRASH';
const PUSH = 'portal/make/PUSH';
const PULL = 'portal/make/PULL';
const SET = 'portal/make/SET';
const REMOVE = 'portal/make/REMOVE';

export type Metadata = {
  +title?: string,
  +description?: string,
  +author?: string,
  +assetStoragePath?: string,
  +thumbnailStoragePath?: string
};

export type Action =
  | {|
      +type: 'portal/make/CREATE',
      +payload: Array<{}>
    |}
  | {|
      +type: 'portal/make/CHANGE',
      +payload: Array<{}>
    |}
  | {|
      +type: 'portal/make/METADATA',
      +payload: Metadata
    |}
  | {|
      +type: 'portal/make/THUMBNAIL',
      +payload: string
    |}
  | {|
      +type: 'portal/make/TRASH'
    |}
  | {|
      +type: 'portal/make/PUSH'
    |}
  | {|
      +type: 'portal/make/PULL'
    |}
  | {|
      +type: 'portal/make/SET',
      +payload: {
        workData: WorkData,
        files: Array<{}>
      }
    |}
  | {|
      +type: 'portal/make/REMOVE'
    |};

export type State = {
  work: WorkItemType,
  saved: boolean,
  metadata: Metadata,
  thumbnails: Array<string>,
  files?: Array<{}>,
  hashOfFiles: string
};

const initialState: State = {
  work: helpers.initialized(),
  saved: false,
  metadata: {},
  thumbnails: [],
  hashOfFiles: ''
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case CREATE:
      return {
        work: helpers.empty(),
        saved: false,
        files: action.payload,
        metadata: {},
        thumbnails: [],
        // JSON 文字列から MD5 ハッシュを計算
        hashOfFiles: hashFiles(action.payload)
      };
    case CHANGE:
      if (hashFiles(action.payload) === state.hashOfFiles) {
        return state; // 変更なし
      }
      return {
        ...state,
        saved: false,
        files: action.payload,
        // JSON 文字列から MD5 ハッシュを計算
        hashOfFiles: hashFiles(action.payload)
      };
    case METADATA:
      return {
        ...state,
        saved: false,
        metadata: {
          ...state.metadata,
          ...action.payload
        }
      };
    case THUMBNAIL:
      return {
        ...state,
        thumbnails: [...state.thumbnails, action.payload]
      };
    case TRASH:
      return {
        work: helpers.initialized(),
        saved: false,
        metadata: {},
        thumbnails: [],
        hashOfFiles: ''
      };
    case PUSH:
    case PULL:
    case REMOVE:
      return {
        ...state,
        work: helpers.processing(),
        saved: false
      };
    case SET:
      const { workData, files } = action.payload;
      return {
        ...state,
        work: helpers.has(workData),
        saved: true,
        files,
        // JSON 文字列から MD5 ハッシュを計算
        hashOfFiles: hashFiles(files),
        metadata: {
          title: workData.title,
          description: workData.description,
          author: workData.author,
          assetStoragePath: workData.assetStoragePath,
          thumbnailStoragePath: workData.thumbnailStoragePath
        }
      };
    default:
      return state;
  }
};

type createType = (payload: Array<{}>) => Action;

export const create: createType = payload => ({
  type: CREATE,
  payload
});

type changeType = (payload: Array<{}>) => Action;

export const change: changeType = payload => ({
  type: CHANGE,
  payload
});

type metadataType = (metadata: Metadata) => Action;

export const metadata: metadataType = payload => ({
  type: METADATA,
  payload
});

type thumbnailType = (thumbnail: string) => Action;

export const thumbnail: thumbnailType = payload => ({
  type: THUMBNAIL,
  payload
});

type trashType = () => Action;

export const trash: trashType = () => ({
  type: TRASH
});

type pushType = () => Action;

export const push: pushType = () => ({
  type: PUSH
});

type pullType = () => Action;

export const pull: pullType = () => ({
  type: PULL
});

type setType = (workData: WorkData, files: Array<{}>) => Action;

export const set: setType = (workData, files) => ({
  type: SET,
  payload: {
    workData,
    files
  }
});

type removeType = () => Action;

export const remove: removeType = () => ({
  type: REMOVE
});

export type changeWorkType = (payload: { files: Array<{}> }) => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const changeWork: changeWorkType = payload => async (
  dispatch,
  getState
) => {
  const { make: { work } } = getState();
  if (work.isProcessing || work.isInvalid) {
    // Sync 中またはエラーがある状態ならスルー
    return;
  }
  // local プロジェクトがあるかどうか
  const hasLocalProject = work.isAvailable || work.isEmpty;
  // files の配列として取り出す
  const project = [];
  for (const file of payload.files) {
    const composed = await file.compose();
    project.push(composed);
  }
  if (!hasLocalProject) {
    // 新しく local project を作る
    dispatch(create(project));
  } else {
    // データだけ上書きする
    dispatch(change(project));
  }
};

export type setMetadataType = (
  payload: Metadata
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const setMetadata: setMetadataType = payload => async (
  dispatch,
  getState
) => {
  dispatch(metadata(payload));
};

export type setThumbnailFromDataURLType = (
  dataURL: string
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const setThumbnailFromDataURL: setThumbnailFromDataURLType = dataURL => async (
  dispatch,
  getState
) => {
  const { make: { work }, auth: { user } } = getState();
  if (!user) {
    // ログインしていない
    return;
  }
  // data url => base64 string and metadata
  const visibility = work.data ? work.data.visibility : 'private';
  const [param, base64] = dataURL.split(',');
  const [, type] = /^data:(.*);base64$/i.exec(param); // e.g. data:image/jpeg;base64
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
  const thumbnailStoragePath = `image/${visibility}/users/${
    user.uid
  }/${uuid()}.${ext}`;
  // Upload to storage
  await dispatch(uploadBlob(thumbnailStoragePath, blob));
  // Set to redux store
  await dispatch(setMetadata({ thumbnailStoragePath }));
};

export type trashWorkType = () => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const trashWork: trashWorkType = () => async (dispatch, getState) => {
  await dispatch(trash());
};

export type saveWorkType = () => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const saveWork: saveWorkType = () => async (dispatch, getState) => {
  const {
    auth: { user },
    make: { files, work, metadata, thumbnails }
  } = getState();

  if (!user || !files || !canSave(getState())) {
    return;
  }

  // TODO: サムネイルを選択する GUI を実装する
  // （仮実装）もしサムネイルが設定されていなければ, thumbnails の先頭をアップロードして設定する
  if (!metadata.thumbnailStoragePath) {
    const [dataURL] = thumbnails;
    if (dataURL) {
      await dispatch(setThumbnailFromDataURL(dataURL));
      // ----> ストアが更新される（はず）
      return dispatch(saveWork());
    }
  }

  // TODO: author を編集する GUI を実装する
  // （仮実装）もし author が設定されていなければ, ログインユーザの DisplayName を author とする
  if (!metadata.author) {
    const userData = getUserByUid(getState(), user.uid).data;
    if (userData && userData.displayName) {
      await dispatch(setMetadata({ author: userData.displayName }));
      // ----> ストアが更新される（はず）
      return dispatch(saveWork());
    }
  }

  dispatch(push());

  try {
    // visibility を取得
    const visibility = work.data ? work.data.visibility : 'private';
    // プロジェクトを JSON に書き出し
    const json = JSON.stringify(files);
    const file = new Blob([json], { type: 'application/json' });
    // Storage にアップロード
    const assetStoragePath = `json/${visibility}/users/${
      user.uid
    }/${uuid()}.json`;
    await dispatch(uploadBlob(assetStoragePath, file));

    // 取得
    const uploadedRef = await uploadWorkData({
      work,
      user,
      metadata: {
        // デフォルト値
        title: '',
        description: '',
        // ユーザーが設定したメタデータ
        ...metadata,
        assetStoragePath
      }
    });
    const snapshot = await uploadedRef.get();
    const uploadedDoc = {
      ...snapshot.data(),
      id: snapshot.id,
      path: `/works/${snapshot.id}`
    };
    dispatch(set(uploadedDoc, files));
    // 古いアセットを削除
    if (work.data && work.data.assetStoragePath) {
      dispatch(removeFile(work.data.assetStoragePath));
    }
    // 古いサムネイルを削除
    if (
      work.data &&
      work.data.thumbnailStoragePath &&
      work.data.thumbnailStoragePath !== metadata.thumbnailStoragePath
    ) {
      dispatch(removeFile(work.data.thumbnailStoragePath));
    }
  } catch (error) {
    console.error(error.message);
  }
};

export type setWorkVisibilityType = (
  visibility: VisibilityType
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const setWorkVisibility: setWorkVisibilityType = visibility => async (
  dispatch,
  getState
) => {
  const { auth: { user }, make: { work, files } } = getState();
  const workData = work.data;
  if (!canPublish(getState()) || !workData || !user || !files) {
    return;
  }
  if (workData.visibility === visibility) {
    // すでにその設定になっている
    return;
  }
  // asset と thumbnail の現在のパスを取得
  const { assetStoragePath, thumbnailStoragePath } = workData;
  if (!assetStoragePath || !thumbnailStoragePath) {
    // JSON ファイルのパスが設定されていない
    return;
  }
  const nextAssetStoragePath = `json/${visibility}/users/${
    user.uid
  }/${uuid()}.${parseStoragePath(assetStoragePath).extention}`;
  const nextThumbnailStoragePath = `image/${visibility}/users/${
    user.uid
  }/${uuid()}.${parseStoragePath(thumbnailStoragePath).extention}`;

  dispatch(push());

  try {
    // asset を移す
    await dispatch(moveFile(assetStoragePath, nextAssetStoragePath));
    await dispatch(downloadUrl(nextAssetStoragePath));
    if (!getStorageByPath(getState(), nextAssetStoragePath).url) {
      // アセットの移動に失敗している
      throw new Error('Failed to moveFile');
    }
    // thumbnail を移す
    await dispatch(moveFile(thumbnailStoragePath, nextThumbnailStoragePath));
    await dispatch(downloadUrl(nextThumbnailStoragePath));
    if (!getStorageByPath(getState(), nextThumbnailStoragePath).url) {
      // サムネイルの移動に失敗している
      throw new Error('Failed to moveFile');
    }

    // 既存のドキュメントを更新
    const updated = {
      assetStoragePath: nextAssetStoragePath,
      thumbnailStoragePath: nextThumbnailStoragePath,
      visibility,
      updatedAt: new Date()
    };
    const ref = firebase
      .firestore()
      .collection('works')
      .doc(workData.id);
    await ref.update(updated);

    const snapshot = await ref.get();
    const updatedDoc = {
      ...snapshot.data(),
      id: snapshot.id,
      path: `/works/${snapshot.id}`
    };
    // ステージをセット
    await dispatch(set(updatedDoc, files));
  } catch (error) {
    // 元に戻す
    console.error(error);
    const { make: { work } } = getState();
    if (!work.data || !work.data.assetStoragePath !== nextAssetStoragePath) {
      await dispatch(moveFile(nextAssetStoragePath, assetStoragePath));
    }
    if (
      !work.data ||
      !work.data.thumbnailStoragePath !== nextThumbnailStoragePath
    ) {
      await dispatch(moveFile(nextThumbnailStoragePath, thumbnailStoragePath));
    }
    await dispatch(set(workData, files));
  }
};

async function uploadWorkData({ work, user, metadata }) {
  const workData = work.data;
  if (workData) {
    // 既存のドキュメントを更新
    const updated = {
      ...metadata,
      uid: user.uid,
      updatedAt: new Date()
    };
    const ref = firebase
      .firestore()
      .collection('works')
      .doc(workData.id);
    await ref.update(updated);
    return ref;
  } else {
    // 新しく追加
    const appended = {
      ...metadata,
      uid: user.uid,
      visibility: 'private',
      viewsNum: 0,
      favsNum: 0,
      createdAt: new Date(),
      updatedAt: null
    };
    const docRef = await firebase
      .firestore()
      .collection('works')
      .add(appended);
    return docRef;
  }
}

export type editExistingWorkType = (
  work: WorkItemType
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const editExistingWork: editExistingWorkType = work => async (
  dispatch,
  getState
) => {
  const { auth: { user }, make } = getState();
  const workData = work.data;
  if (!workData || !user || workData.uid !== user.uid || make.work.data) {
    // 自分のステージではないか、ログインしていないか、すでに別のものを作り始めている
    return;
  }
  const { assetStoragePath, asset_url } = workData;
  let url;
  if (assetStoragePath) {
    // アセットをダウンロード
    await dispatch(downloadUrl(assetStoragePath));
    const storage = getStorageByPath(getState(), assetStoragePath);
    if (!storage.url) {
      return;
    }
    url = storage.url;
  } else if (asset_url) {
    url = asset_url;
  } else {
    // どちらもない
    return;
  }
  const response = await fetch(url);
  const text = await response.text();
  const files = JSON.parse(text); // : Array<{}>
  // ステージをセット
  await dispatch(set(workData, files));
};

export type removeWorkType = () => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const removeWork: removeWorkType = work => async (
  dispatch,
  getState
) => {
  const { make: { work } } = getState();
  const workData = work.data;
  if (!canRemove(getState()) || !workData) {
    return;
  }
  dispatch(remove());
  // ストレージからデータを削除
  if (workData.assetStoragePath) {
    await dispatch(removeFile(workData.assetStoragePath));
  }
  if (workData.thumbnailStoragePath) {
    await dispatch(removeFile(workData.thumbnailStoragePath));
  }
  // DB から削除
  await firebase
    .firestore()
    .doc(workData.path)
    .delete();
  dispatch(trash());
  // その work を空とみなす
  dispatch(empty(workData.path));
};

export function canSave(state: $Call<GetState>) {
  const { make: { files, hashOfFiles, saved, work }, auth: { user } } = state;
  if (!files || !hashOfFiles || saved || !user) {
    // 制作中のプロジェクトがないか、すでにセーブ済みか、ログインしていない
    return false;
  }
  return work.isEmpty || work.isAvailable;
}

export function canPublish(state: $Call<GetState>) {
  const { make: { saved, work }, auth: { user } } = state;
  const workData = work.data;
  if (!workData || !saved || !user || user.uid !== workData.uid) {
    // 保存されていないか、ログインしていない
    return false;
  }
  return Boolean(
    workData.assetStoragePath && workData.thumbnailStoragePath && workData.title
  );
}

export function canRemove(state: $Call<GetState>) {
  const { make: { work }, auth: { user } } = state;
  const workData = work.data;
  if (!workData || !user || user.uid !== workData.uid) {
    // 保存されていないか、ログインしていない
    return false;
  }
  return true;
}

const hashFilesCache: WeakMap<Array<{}>, string> = new WeakMap();
export function hashFiles(files: Array<{}>) {
  const cache = hashFilesCache.get(files);
  if (cache) return cache;
  const hash = md5(JSON.stringify(files));
  hashFilesCache.set(files, hash);
  return hash;
}
