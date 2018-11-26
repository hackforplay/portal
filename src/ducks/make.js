// @flow
import firebase from 'firebase';
import 'firebase/firestore';
import md5 from 'md5';
import mime from 'mime-types';
import uuid from 'uuid/v4';
import { actionCreatorFactory, type ActionCreator } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import debounce from 'debounce';

import * as helpers from './helpers';
import {
  downloadUrl,
  uploadBlob,
  getStorageByPath,
  moveFile,
  removeFile,
  parseStoragePath
} from './storage';
import * as userImport from './user';
import * as workImport from './work';
import * as authImport from './auth';
import type { Dispatch, GetStore } from './type';
import type { WorkItemType, VisibilityType } from './work';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'make';

export type Metadata = {
  +title?: string,
  +description?: string,
  +author?: string,
  +assetStoragePath?: string,
  +thumbnailStoragePath?: string
};

const actionCreator = actionCreatorFactory('portal/make');
export const actions = {
  create: actionCreator('CREATE'),
  change: actionCreator('CHANGE'),
  metadata: (actionCreator('METADATA'): ActionCreator<Metadata>),
  thumbnail: actionCreator('THUMBNAIL'),
  trash: actionCreator('TRASH'),
  push: actionCreator.async('PUSH'),
  pull: actionCreator.async('PULL'),
  remove: actionCreator.async('REMOVE'),
  upload: actionCreator.async('UPLOAD')
};

export type FeelesFile = {
  compose: () => Promise<Object>
};

// redux-thunk and flow-type compat
export type Action = {};

export type State = {
  work: WorkItemType,
  saved: boolean, // 現時点での files が保存されているか
  uploading: boolean,
  changed: boolean, // 起動時から一度でもファイルが変更されたか
  error: null | Error,
  metadata: Metadata,
  thumbnails: Array<string>,
  files?: Array<{}>,
  hashOfFiles: string
};

const initialState: State = {
  work: helpers.initialized(),
  saved: false,
  uploading: false,
  changed: false,
  error: null,
  metadata: {},
  thumbnails: [],
  hashOfFiles: ''
};

// Root Reducer
export default reducerWithInitialState(initialState)
  .case(actions.create, (state, files) => {
    const next: State = {
      work: helpers.empty(),
      saved: false,
      uploading: false,
      changed: false,
      error: null,
      files,
      metadata: {},
      thumbnails: [],
      // JSON 文字列から MD5 ハッシュを計算
      hashOfFiles: hashFiles(files)
    };
    return next;
  })
  .case(actions.change, (state, files) => {
    if (hashFiles(files) === state.hashOfFiles) {
      return state; // 変更なし
    }
    const next: State = {
      ...state,
      saved: false,
      changed: true,
      files,
      // JSON 文字列から MD5 ハッシュを計算
      hashOfFiles: hashFiles(files)
    };
    return next;
  })
  .case(actions.metadata, (state, metadata) => {
    const next: State = {
      ...state,
      metadata: {
        ...state.metadata,
        ...metadata
      }
    };
    return next;
  })
  .case(actions.thumbnail, (state, dataUrl) => {
    const next: State = {
      ...state,
      thumbnails: [dataUrl].concat(state.thumbnails.slice(0, 5))
    };
    return next;
  })
  .cases([actions.trash, actions.remove.done], state => {
    const next: State = {
      work: helpers.initialized(),
      saved: false,
      uploading: false,
      changed: false,
      error: null,
      metadata: {},
      thumbnails: [],
      hashOfFiles: ''
    };
    return next;
  })
  .case(actions.remove.failed, (state, { error }) => {
    const next: State = {
      work: helpers.invalid(error),
      saved: false,
      uploading: false,
      changed: false,
      error,
      metadata: {},
      thumbnails: [],
      hashOfFiles: ''
    };
    return next;
  })
  .cases(
    [actions.push.started, actions.pull.started, actions.remove.started],
    state => {
      const next: State = {
        ...state,
        error: null,
        work: helpers.processing(),
        saved: false
      };
      return next;
    }
  )
  .cases(
    [actions.push.done, actions.pull.done],
    (state, { result: { workData, files } }) => {
      const next: State = {
        ...state,
        error: null,
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
      return next;
    }
  )
  .case(actions.push.failed, (state, { params, error }) => {
    const next: State = {
      ...state,
      error,
      work: helpers.has(params.workData)
    };
    return next;
  })
  .case(actions.pull.failed, (state, { error }) => {
    const next: State = {
      ...state,
      error,
      work: helpers.invalid(error)
    };
    return next;
  })
  .case(actions.upload.started, state => {
    const next: State = {
      ...state,
      error: null,
      uploading: true
    };
    return next;
  })
  .case(actions.upload.done, (state, { result }) => {
    const next: State = {
      ...state,
      uploading: false,
      metadata: {
        ...state.metadata,
        ...result
      }
    };
    return next;
  })
  .case(actions.upload.failed, (state, { error }) => {
    const next: State = {
      ...state,
      error,
      uploading: false
    };
    return next;
  });

export type changeWorkType = (payload: { files: FeelesFile[] }) => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const changeWork: changeWorkType = payload => async (
  dispatch,
  getStore
) => {
  const { work } = getState(getStore());
  const { user } = authImport.getState(getStore());
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
    dispatch(actions.create(project));
  } else {
    // データだけ上書きする
    dispatch(actions.change(project));
  }
  // もし, 他人の作品でなく, ログインもしているなら, そのままセーブする
  const workData = work.data;
  if (user && (!workData || user.uid === workData.uid)) {
    await dispatch(executeAutoSave());
  }
};

export type setThumbnailFromDataURLType = (
  dataURL: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const setThumbnailFromDataURL: setThumbnailFromDataURLType = dataURL => async (
  dispatch,
  getStore
) => {
  const { work } = getState(getStore());
  const { user } = authImport.getState(getStore());
  if (!user) {
    // ログインしていない
    return;
  }
  // data url => base64 string and metadata
  const visibility = work.data ? work.data.visibility : 'private';
  const [param, base64] = dataURL.split(',');
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
  const thumbnailStoragePath = `image/${visibility}/users/${
    user.uid
  }/${uuid()}.${ext}`;
  try {
    dispatch(actions.upload.started());
    // Upload to storage
    await dispatch(uploadBlob(thumbnailStoragePath, blob));
    // Set to redux store
    dispatch(actions.upload.done({ result: { thumbnailStoragePath } }));
  } catch (error) {
    dispatch(actions.upload.failed({ error }));
    console.error(error);
  }
};

const _executeAutoSave = debounce(async (dispatch, getStore) => {
  const { uid } = authImport.getState(getStore()).user || { uid: '' };
  const { files, work, metadata, thumbnails } = getState(getStore());

  if (!uid || !files || !canSave(getStore())) {
    return;
  }

  const visibility = work.data ? work.data.visibility : 'private'; // デフォルトは非公開

  // 前処理
  // もしステージが「公開中」でないなら, サムネイルを自動更新する
  if (visibility !== 'public') {
    const [dataURL] = thumbnails;
    if (dataURL) {
      await dispatch(setThumbnailFromDataURL(dataURL));
      // ----> ストアが更新される（はず）
    }
  }
  // TODO: author を編集する GUI を実装する
  // （仮実装）もし author が設定されていなければ, ログインユーザの DisplayName を author とする
  if (!metadata.author) {
    const userData = userImport.getUserByUid(getStore(), uid).data;
    if (userData && userData.displayName) {
      await dispatch(actions.metadata({ author: userData.displayName }));
      // ----> ストアが更新される（はず）
    }
  }

  await dispatch(saveWork()); // eslint-disable-line no-use-before-define
}, 5000);

/**
 * 前処理+保存を行う. 連続で呼び出されても大丈夫なように, debounce されている
 */
export function executeAutoSave() {
  return _executeAutoSave;
}

export type saveWorkType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const saveWork: saveWorkType = () => async (dispatch, getStore) => {
  const { uid } = authImport.getState(getStore()).user || { uid: '' };
  const { files, work, metadata } = getState(getStore());

  if (!uid || !files || !canSave(getStore())) {
    return;
  }

  try {
    dispatch(actions.push.started({ params: { workData: work.data } }));

    // visibility を取得
    const visibility = work.data ? work.data.visibility : 'private';
    // プロジェクトを JSON に書き出し
    const json = JSON.stringify(files);
    const file = new Blob([json], { type: 'application/json' });
    // Storage にアップロード
    const assetStoragePath = `json/${visibility}/users/${uid}/${uuid()}.json`;
    await dispatch(uploadBlob(assetStoragePath, file));

    // 取得
    const uploadedRef = await uploadWorkData({
      work,
      uid,
      metadata: {
        // デフォルト値
        title: '',
        description: '',
        // ユーザーが設定したメタデータ
        ...metadata,
        assetStoragePath
      }
    });
    const snapshot = (await uploadedRef.get(): $npm$firebase$firestore$DocumentSnapshot);
    const result = {
      workData: workImport.getWorkData(snapshot),
      files
    };
    dispatch(
      actions.push.done({
        params: { workData: work.data },
        result
      })
    );

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
    console.error(error);
    dispatch(
      actions.push.failed({
        params: { workData: work.data },
        error
      })
    );
  }
};

export type setWorkVisibilityType = (
  visibility: VisibilityType
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const setWorkVisibility: setWorkVisibilityType = visibility => async (
  dispatch,
  getStore
) => {
  const { user } = authImport.getState(getStore());
  const { work, files } = getState(getStore());
  const workData = work.data;
  if (!canPublish(getStore()) || !workData || !user || !files) {
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

  try {
    dispatch(actions.push.started());
    // asset を移す
    await dispatch(moveFile(assetStoragePath, nextAssetStoragePath));
    await dispatch(downloadUrl(nextAssetStoragePath));
    if (!getStorageByPath(getStore(), nextAssetStoragePath).url) {
      // アセットの移動に失敗している
      throw new Error('Failed to moveFile');
    }
    // thumbnail を移す
    await dispatch(moveFile(thumbnailStoragePath, nextThumbnailStoragePath));
    await dispatch(downloadUrl(nextThumbnailStoragePath));
    if (!getStorageByPath(getStore(), nextThumbnailStoragePath).url) {
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

    const snapshot = (await ref.get(): $npm$firebase$firestore$DocumentSnapshot);
    // ステージをセット
    await dispatch(
      actions.push.done({
        result: {
          workData: workImport.getWorkData(snapshot),
          files
        }
      })
    );
  } catch (error) {
    // 元に戻す
    console.error(error);
    const { work } = getState(getStore());
    if (!work.data || !work.data.assetStoragePath !== nextAssetStoragePath) {
      await dispatch(moveFile(nextAssetStoragePath, assetStoragePath));
    }
    if (
      !work.data ||
      !work.data.thumbnailStoragePath !== nextThumbnailStoragePath
    ) {
      await dispatch(moveFile(nextThumbnailStoragePath, thumbnailStoragePath));
    }
    await dispatch(
      actions.push.done({
        result: {
          workData,
          files
        }
      })
    );
  }
};

async function uploadWorkData({ work, uid, metadata }) {
  const workData = work.data;
  if (workData) {
    // 既存のドキュメントを更新
    const updated = {
      ...metadata,
      uid,
      updatedAt: new Date()
    };
    const ref = firebase
      .firestore()
      .collection('works')
      .doc(workData.id);
    await ref.update(updated);
    return (ref: $npm$firebase$firestore$DocumentReference);
  } else {
    // 新しく追加
    const appended = {
      ...metadata,
      uid,
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
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const editExistingWork: editExistingWorkType = work => async (
  dispatch,
  getStore
) => {
  const make = getState(getStore());
  const { user } = authImport.getState(getStore());
  const workData = work.data;
  if (!workData || !user || workData.uid !== user.uid || make.work.data) {
    // 自分のステージではないか、ログインしていないか、すでに別のものを作り始めている
    return;
  }
  try {
    dispatch(actions.pull.started());
    const { assetStoragePath, asset_url } = workData;
    let url;
    if (assetStoragePath) {
      // アセットをダウンロード
      await dispatch(downloadUrl(assetStoragePath));
      const storage = getStorageByPath(getStore(), assetStoragePath);
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
    await dispatch(actions.pull.done({ result: { workData, files } }));
  } catch (error) {
    console.error(error);
    await dispatch(actions.pull.failed({ error }));
  }
};

export type removeWorkType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const removeWork: removeWorkType = () => async (dispatch, getStore) => {
  const {
    work: { data }
  } = getState(getStore());
  if (!canRemove(getStore()) || !data) {
    return;
  }
  try {
    dispatch(actions.remove.started());
    // DB から削除する
    await dispatch(workImport.removeWork(data));
    dispatch(actions.remove.done());
  } catch (error) {
    actions.remove.failed({ error });
  }
};

export function canSave(state: $Call<GetStore>) {
  const {
    make: { files, hashOfFiles, saved, uploading, work, metadata, thumbnails },
    auth: { user }
  } = state;

  // サムネイルが設定されているか、撮影されたものがある (設定することができる)
  const hasThumbnail = metadata.thumbnailStoragePath || thumbnails.length > 0;
  if (!files || !hashOfFiles || saved || !user || !hasThumbnail || uploading) {
    // 制作中のプロジェクトがないか、すでにセーブ済みか、ログインしていないか、サムネイルをアップロード中
    return false;
  }
  return work.isEmpty || work.isAvailable;
}

export function canPublish(state: $Call<GetStore>) {
  const {
    make: { saved, work },
    auth: { user }
  } = state;
  const workData = work.data;
  if (!workData || !saved || !user || user.uid !== workData.uid) {
    // 保存されていないか、ログインしていない
    return false;
  }
  return Boolean(
    workData.assetStoragePath && workData.thumbnailStoragePath && workData.title
  );
}

export function canRemove(state: $Call<GetStore>) {
  const {
    make: { work },
    auth: { user }
  } = state;
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

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
