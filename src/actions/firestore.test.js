import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  collection,
  request,
  getCanonical,
  requestDocuments,
  receiveDocuments,
  receiveFailure
} from './firestore';
import {
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../constants/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const query = collection('users').where('custom_id', '==', 'test_user');

Date.now = jest.fn().mockReturnValue(1507451369889);

describe('firestore', () => {
  it('creates REQUEST_DOCUMENTS and RECEIVE_DOCUMENTS when request is done', async () => {
    const store = mockStore({ queryStates: {}, collections: { users: {} } });

    await store.dispatch(request(query));

    expect(store.getActions()).toEqual([
      requestDocuments(query),
      receiveDocuments(query, [])
    ]);
  });

  it('avoids REQUEST_DOCUMENTS when request called but already exist', async () => {
    const store = mockStore({
      queryStates: {
        [getCanonical(query)]: {
          isFetching: false,
          didInvalidate: false,
          error: null
        }
      }
    });

    await store.dispatch(request(query));

    expect(store.getActions()).toEqual([]);
  });
});
