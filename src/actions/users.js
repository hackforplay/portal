import { requestDocuments } from './firestore';

export const findUser = (state, id) => {
  return state.collections.users.find(user => {
    return user.custom_id === id || user.uid === id;
  });
};

export const fetchUser = id => async (dispatch, getState) => {
  for (const field of ['custom_id', 'uid']) {
    const query = {
      collectionPath: 'users',
      where: [field, '==', id]
    };
    if (!findUser(getState(), id)) {
      // もし他の方法でユーザーが見つかっていないなら一つずつクエリを実行する
      await dispatch(requestDocuments(query));
    }
  }
};

export const isFetchingUser = (state, id) => {
  for (const field of ['custom_id', 'uid']) {
    const query = {
      collectionPath: 'users',
      where: [field, '==', id]
    };
    const queryJson = JSON.stringify(query);
    const queryState = state.queryStates[queryJson];
    if (queryState && queryState.isFetching) {
      // 処理中のクエリが存在している => 処理中である
      return true;
    }
  }
  if (findUser(state, id)) {
    // すでにユーザーが見つかっている => 処理中ではない
    return false;
  }
  // まだ何も行われていない => 処理中である
  return true;
};
