import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchUser } from './users';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockUser = jest.fn().mockReturnValue({
  custom_id: 'test_user',
  uid: 'xQB0M7SyYDYblL0v6MsyEdeBtgJ3'
});

describe('user actions', () => {
  it('fetching test_user is done', async () => {
    const store = mockStore({ queryStates: {}, collections: { users: [] } });

    await store.dispatch(fetchUser('test_user'));

    expect(store.getActions()).not.toEqual([]);
  });

  it('avoid fetching when test_user already exist', async () => {
    const store = mockStore({
      queryStates: {},
      collections: { users: [mockUser()] }
    });

    await store.dispatch(fetchUser('test_user'));
    await store.dispatch(fetchUser('xQB0M7SyYDYblL0v6MsyEdeBtgJ3'));

    expect(store.getActions()).toEqual([]);
  });
});
