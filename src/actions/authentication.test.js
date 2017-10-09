import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import firebase from './firebase';
import { init, SIGN_OUT } from './authentication';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('firebase authentications', () => {
  it('creates SIGN_OUT when user did not sign in', async () => {
    const store = mockStore({});

    // Authorization is initalized but, ...
    store.dispatch(init());

    await new Promise(resolve => setImmediate(resolve));

    // ... User did not sign in
    expect(store.getActions()).toEqual([{ type: SIGN_OUT }]);
  });
});
