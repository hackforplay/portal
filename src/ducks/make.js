// @flow
import firebase from 'firebase';
import 'firebase/firestore';
import md5 from 'md5';

import * as helpers from './helpers';
import { uploadBlob, getStorageByPath } from './storage';
import type { Dispatch, GetState } from './';
import type { WorkItemType, WorkData } from './work';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'make';

const CREATE = 'portal/make/CREATE';
const CHANGE = 'portal/make/CHANGE';
const TRASH = 'portal/make/TRASH';
const PUSH = 'portal/make/PUSH';
const PULL = 'portal/make/PULL';
const SET = 'portal/make/SET';

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
    |};

export type State = {
  work: WorkItemType,
  saved: boolean,
  files?: Array<{}>
};

const initialState: State = {
  work: helpers.initialized(),
  saved: false
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case CREATE:
      return {
        work: helpers.empty(),
        saved: false,
        files: action.payload
      };
    case CHANGE:
      return {
        ...state,
        saved: false,
        files: action.payload
      };
    case TRASH:
      return {
        ...state,
        work: helpers.initialized(),
        saved: false
      };
    case PUSH:
    case PULL:
      return {
        ...state,
        work: helpers.processing(),
        saved: false
      };
    case SET:
      return {
        ...state,
        work: helpers.has(action.payload),
        saved: true
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

export type trashWorkType = () => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const trashWork: trashWorkType = () => async (dispatch, getState) => {
  dispatch(trash());
};

type UploadDataType = {
  title: string,
  description: string,
  author: string
};

export type saveWorkType = (
  data: UploadDataType
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const saveWork: saveWorkType = data => async (dispatch, getState) => {
  const { auth: { user }, make: { saved, files, work } } = getState();
  const { title, description, author } = data;

  if (!files || saved || !user) {
    // 制作中のプロジェクトがないか、すでにセーブ済みか、ログインしていない
    return;
  }

  dispatch(push());

  try {
    // visibility を取得
    const visibility = work.data ? work.data.visibility : 'private';
    // プロジェクトを JSON に書き出し
    const json = JSON.stringify(files);
    const file = new Blob([json], { type: 'application/json' });
    // JSON 文字列から MD5 ハッシュを計算
    const hash = md5(json);
    // Storage にアップロード
    const storagePath = `json/${visibility}/users/${user.uid}/${hash}.json`;
    await dispatch(uploadBlob(storagePath, file));

    // 取得
    const uploadedRef = await uploadWorkData({
      work,
      user,
      storagePath,
      title,
      description,
      author
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

export type publishWorkType = () => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const publishWork: publishWorkType = () => async (
  dispatch,
  getState
) => {
  const { auth: { user }, make: { work } } = getState();
  const workData = work.data;
  if (!workData || !workData.assetStoragePath || !user) {
    // 作品が投稿されていないか、ログインしていない
    return;
  }
  dispatch(push());

  // プロジェクトの JSON を取得
  const { assetStoragePath } = workData;
  if (!assetStoragePath) {
    // JSON ファイルのパスが設定されていない
    return;
  }
  const asset = getStorageByPath(getState(), assetStoragePath);
  if (!asset.url) {
    // ダウンロードされていない
    return;
  }
  const response = await fetch(asset.url);
  const json = await response.text();
  const file = new Blob([json], { type: 'application/json' });
  // JSON 文字列から MD5 ハッシュを計算
  const hash = md5(json);
  // Storage にアップロード
  const storagePath = `json/public/users/${user.uid}/${hash}.json`;
  await dispatch(uploadBlob(storagePath, file));

  // 既存のドキュメントを更新
  const updated = {
    assetStoragePath: storagePath,
    visibility: 'public',
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
};

async function uploadWorkData({
  work,
  user,
  storagePath,
  title,
  description,
  author
}) {
  const workData = work.data;
  if (workData) {
    // 既存のドキュメントを更新
    const updated = {
      uid: user.uid,
      title,
      description,
      author,
      assetStoragePath: storagePath,
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
      uid: user.uid,
      title,
      description,
      author,
      visibility: 'private',
      assetStoragePath: storagePath,
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
