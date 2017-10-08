import { collections as reducer } from './collections';
import { RECEIVE_DOCUMENTS } from '../actions';

describe('collections reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      users: [],
      products: []
    });
  });

  it('should handle RECEIVE_DOCUMENTS', () => {
    let state = reducer(undefined, {
      type: RECEIVE_DOCUMENTS,
      query: { collectionPath: 'users' },
      docs: [new UserMock()]
    });

    expect(state).toEqual({
      users: [
        {
          id: 'uid 1',
          display_name: 'tera'
        }
      ],
      products: []
    });

    state = reducer(state, {
      type: RECEIVE_DOCUMENTS,
      query: { collectionPath: 'products' },
      docs: [new ProductMock(), new ProductMock()]
    });

    expect(state).toEqual({
      users: [
        {
          id: 'uid 1',
          display_name: 'tera'
        }
      ],
      products: [
        {
          id: 'uid 2',
          title: 'Amazing Adventure'
        },
        {
          id: 'uid 3',
          title: 'Amazing Adventure'
        }
      ]
    });
  });
});

const mockId = jest
  .fn()
  .mockReturnValueOnce('uid 1')
  .mockReturnValueOnce('uid 2')
  .mockReturnValueOnce('uid 3');

class UserMock {
  get id() {
    return mockId();
  }
  data() {
    return { display_name: 'tera' };
  }
}

class ProductMock {
  get id() {
    return mockId();
  }
  data() {
    return { title: 'Amazing Adventure' };
  }
}
