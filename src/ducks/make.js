// @flow
import firebase from 'firebase';
import 'firebase/firestore';
import md5 from 'md5';
import mime from 'mime-types';

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
      +payload: WorkData
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
        hashOfFiles: md5(JSON.stringify(action.payload))
      };
    case CHANGE:
      // JSON 文字列から MD5 ハッシュを計算
      const hashOfFiles = md5(JSON.stringify(action.payload));
      if (hashOfFiles === state.hashOfFiles) {
        return state; // 変更なし
      }
      return {
        ...state,
        saved: false,
        files: action.payload
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
      return {
        ...state,
        work: helpers.has(action.payload),
        saved: true,
        metadata: {
          title: action.payload.title,
          description: action.payload.description,
          author: action.payload.author,
          assetStoragePath: action.payload.assetStoragePath,
          thumbnailStoragePath: action.payload.thumbnailStoragePath
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

type setType = (payload: WorkData) => Action;

export const set: setType = payload => ({
  type: SET,
  payload
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
  const visibility = work.data ? work.data.visibility : 'private';
  const [param, base64] = dataURL.split(',');
  const [, type] = /^data:(.*);base64$/i.exec(param); // e.g. data:image/jpeg;base64
  const ext = mime.extension(type);
  if (base64 && type && ext) {
    const bin = atob(base64); // base64 encoded string => binary string
    let byteArray = new Uint8Array(bin.length); // binary string => 8bit TypedArray
    for (let i = bin.length - 1; i >= 0; i--) {
      byteArray[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([byteArray.buffer], { type });
    const hash = md5(byteArray);
    const thumbnailStoragePath = `image/${visibility}/users/${
      user.uid
    }/${hash}.${ext}`;
    await dispatch(uploadBlob(thumbnailStoragePath, blob));
    await dispatch(setMetadata({ thumbnailStoragePath }));
  }
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
    make: { files, hashOfFiles, work, metadata, thumbnails }
  } = getState();

  if (!user || !canSave(getState())) {
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
    }/${hashOfFiles}.json`;
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
        assetStoragePath,
        ...metadata
      }
    });
    const snapshot = await uploadedRef.get();
    const uploadedDoc = {
      ...snapshot.data(),
      id: snapshot.id,
      path: `/works/${snapshot.id}`
    };
    dispatch(set(uploadedDoc));
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
  const { auth: { user }, make: { work } } = getState();
  const workData = work.data;
  if (!canPublish(getState()) || !workData || !user) {
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
  const nextAssetStoragePath = `json/${visibility}/users/${user.uid}/${
    parseStoragePath(assetStoragePath).fileName
  }`;
  const nextThumbnailStoragePath = `image/${visibility}/users/${user.uid}/${
    parseStoragePath(thumbnailStoragePath).fileName
  }`;

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
    // 作品をセット
    dispatch(set(updatedDoc));
  } catch (error) {
    // 元に戻す
    console.error(error);
    await dispatch(moveFile(assetStoragePath, nextAssetStoragePath));
    await dispatch(moveFile(thumbnailStoragePath, nextThumbnailStoragePath));
    await dispatch(set(workData));
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
) => (dispatch: Dispatch, getState: GetState) => void;

export const editExistingWork: editExistingWorkType = work => (
  dispatch,
  getState
) => {
  const { auth: { user } } = getState();
  if (!work.data || !user || work.data.uid !== user.uid) {
    // 自分の作品ではないか、ログインしていない
    return;
  }
  // 作品をセット
  dispatch(set(work.data));
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
