import firebase from './firebase';
import 'firebase/firestore';

import {
  INVALIDATE_QUERY,
  REQUEST_QUERY,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../constants/actionTypes';

// To use offline
if (process.env.NODE_ENV === 'production') {
  firebase.firestore().enablePersistence();
}

export const invalidateQuery = query => ({
  type: INVALIDATE_QUERY,
  query
});

const requestQuery = query => ({
  type: REQUEST_QUERY,
  query
});

const receiveDocuments = (query, docs) => ({
  type: RECEIVE_DOCUMENTS,
  query,
  docs,
  receivedAt: Date.now()
});

const receiveFailure = (query, error) => ({
  type: RECEIVE_FAILUER,
  query,
  error,
  receivedAt: Date.now()
});

// https://firebase.google.com/docs/firestore/quickstart
export const executeQuery = query => async dispatch => {
  dispatch(requestQuery(query));

  try {
    console.log(firebase.firestore().Query, firebase.firestore.Query);
    let ref = await new firebase.firestore.Query(
      query.collectionPath,
      firebase.firestore()
    );
    // let ref = firebase.firestore().collection();
    if (query.where) {
      ref = ref.where(...query.where);
    }
    const collection = await ref.get();
    dispatch(receiveDocuments(query, collection.docs));
  } catch (error) {
    dispatch(receiveFailure(query, error));
  }
};

const shouldQueryExecuted = (state, query) => {
  const queryJson = JSON.stringify(query);
  const queryState = state.queryStates[queryJson];
  if (!queryState) {
    // そのクエリはまだ store に存在しない => 処理すべき
    return true;
  }
  if (queryState.isFetching) {
    // そのクエリは処理中である => すべきでない
    return false;
  }
  // クエリは無効とみなされている => 処理すべき
  return queryState.didInvalidate;
};

export const requestDocuments = query => async (dispatch, getState) => {
  if (shouldQueryExecuted(getState(), query)) {
    await dispatch(executeQuery(query));
  }
};
