import randomstring from 'randomstring';
import { collections, documents } from './collections';
import { REQUEST_DOCUMENTS, RECEIVE_DOCUMENTS } from '../constants/actionTypes';

const mockDoc = jest.fn(() => {
  const data = {
    field_1: randomstring.generate(100),
    field_2: randomstring.generate(100)
  };
  return {
    id: randomstring.generate(28),
    data() {
      return data;
    }
  };
});

describe('collections reducer', () => {
  it('should return the initial state', () => {
    expect(collections(undefined, {})).toEqual({
      users: [],
      products: []
    });
  });

  it('documents should handle RECEIVE_DOCUMENTS', () => {
    const action = {
      type: RECEIVE_DOCUMENTS,
      path: 'users',
      docs: [mockDoc(), mockDoc()]
    };

    const state = documents(undefined, action);

    expect(state).toEqual([
      {
        id: action.docs[0].id,
        field_1: action.docs[0].data().field_1,
        field_2: action.docs[0].data().field_2
      },
      {
        id: action.docs[1].id,
        field_1: action.docs[1].data().field_1,
        field_2: action.docs[1].data().field_2
      }
    ]);
  });

  it('collections should contains documents', () => {
    const action1 = {
      type: RECEIVE_DOCUMENTS,
      path: 'users',
      docs: [mockDoc(), mockDoc()]
    };
    const action2 = {
      type: RECEIVE_DOCUMENTS,
      path: 'products',
      docs: [mockDoc(), mockDoc()]
    };

    let state = collections(undefined, action1);

    expect(state).toEqual({
      users: documents(undefined, action1),
      products: []
    });

    state = collections(state, action2);

    expect(state).toEqual({
      users: documents(undefined, action1),
      products: documents(undefined, action2)
    });
  });

  it('replace document which has overlapped id', () => {
    const action = {
      type: RECEIVE_DOCUMENTS,
      path: 'users',
      docs: [mockDoc()]
    };

    // Do the same action twice
    const state1 = documents(undefined, action);
    const state2 = documents(state1, action);

    expect(state1).toEqual(state2);
  });
});
