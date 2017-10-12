import firebase from './firebase';
import 'firebase/firestore';

import {
  INVALIDATE_QUERY,
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../constants/actionTypes';

// See also https://firebase.google.com/docs/firestore/quickstart

// To use offline
if (process.env.NODE_ENV === 'production') {
  firebase.firestore().enablePersistence();
}

export const collection = collectionPath =>
  firebase.firestore().collection(collectionPath);

export const getCanonical = query => query._query.canonicalId();

export const getCollectionPath = query => query._query.path.segments.join('/');

export const invalidateQuery = query => ({
  type: INVALIDATE_QUERY,
  canonical: getCanonical(query),
  path: getCollectionPath(query),
  query
});

export const requestDocuments = query => ({
  type: REQUEST_DOCUMENTS,
  canonical: getCanonical(query),
  path: getCollectionPath(query),
  query
});

export const receiveDocuments = (query, docs) => ({
  type: RECEIVE_DOCUMENTS,
  canonical: getCanonical(query),
  path: getCollectionPath(query),
  query,
  docs,
  receivedAt: Date.now()
});

export const receiveFailure = (query, error) => ({
  type: RECEIVE_FAILUER,
  canonical: getCanonical(query),
  path: getCollectionPath(query),
  query,
  error,
  receivedAt: Date.now()
});

const shouldQueryExecuted = (state, query) => {
  const canonical = getCanonical(query);
  const queryState = state.queryStates[canonical];
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

export const request = (...queries) => async (dispatch, getState) => {
  for (const query of queries) {
    if (shouldQueryExecuted(getState(), query)) {
      try {
        dispatch(requestDocuments(query));
        const collection = await query.get();
        dispatch(receiveDocuments(query, collection.docs));
      } catch (error) {
        dispatch(receiveFailure(query, error));
      }
    }
  }
};

export const isFetching = (state, ...queries) => {
  for (const query of queries) {
    const canonical = getCanonical(query);
    const queryState = state.queryStates[canonical];
    if (!queryState) {
      // そのクエリはまだ store に存在しない => 処理中
      return true;
    }
    if (queryState && queryState.isFetching) {
      // そのクエリは処理中である => 処理中
      return true;
    }
  }
  // 処理中のクエリは存在しない
  return false;
};
