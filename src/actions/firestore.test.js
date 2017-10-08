import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  REQUEST_QUERY,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER,
  requestDocuments
} from './firestore';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockQuery = jest.fn().mockReturnValue({
  collectionPath: 'users'
});

Date.now = jest.fn().mockReturnValue(1507451369889);

describe('firestore', () => {
  it('creates REQUEST_QUERY and RECEIVE_DOCUMENTS when requestDocuments is done', async () => {
    const store = mockStore({ queryStates: {}, collections: { users: {} } });

    await store.dispatch(requestDocuments(mockQuery()));

    expect(store.getActions()).toEqual([
      {
        type: REQUEST_QUERY,
        query: mockQuery()
      },
      {
        type: RECEIVE_DOCUMENTS,
        query: mockQuery(),
        docs: [],
        receivedAt: Date.now()
      }
    ]);
  });

  it('avoids REQUEST_QUERY when requestDocuments called but already exist', async () => {
    const store = mockStore({
      queryStates: {
        [JSON.stringify(mockQuery())]: {
          isFetching: false,
          didInvalidate: false,
          error: null
        }
      }
    });

    await store.dispatch(requestDocuments(mockQuery()));

    expect(store.getActions()).toEqual([]);
  });
});
