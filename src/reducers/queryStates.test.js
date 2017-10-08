import { queryStates as reducer } from './queryStates';
import {
  INVALIDATE_QUERY,
  REQUEST_QUERY,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../actions';

const mockQuery = jest.fn().mockReturnValue({
  where: ['custom_id', '==', 'hackforplay']
});

describe('queryStates reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle INVALIDATE_QUERY', () => {
    expect(
      reducer(
        {
          [JSON.stringify(mockQuery())]: {
            isFetching: false,
            didInvalidate: false,
            error: null
          }
        },
        {
          type: INVALIDATE_QUERY,
          query: mockQuery()
        }
      )
    ).toEqual({
      [JSON.stringify(mockQuery())]: {
        isFetching: false,
        didInvalidate: true,
        error: null
      }
    });
  });

  it('should handle REQUEST_QUERY', () => {
    expect(
      reducer(undefined, {
        type: REQUEST_QUERY,
        query: mockQuery()
      })
    ).toEqual({
      [JSON.stringify(mockQuery())]: {
        isFetching: true,
        didInvalidate: false,
        error: null
      }
    });
  });

  it('should handle RECEIVE_DOCUMENTS', () => {
    expect(
      reducer(
        {
          [JSON.stringify(mockQuery())]: {
            isFetching: true,
            didInvalidate: false,
            error: null
          }
        },
        {
          type: RECEIVE_DOCUMENTS,
          query: mockQuery(),
          docs: []
        }
      )
    ).toEqual({
      [JSON.stringify(mockQuery())]: {
        isFetching: false,
        didInvalidate: false,
        error: null
      }
    });
  });

  it('should handle RECEIVE_FAILUER', () => {
    const error = new Error('Error');
    expect(
      reducer(
        {
          [JSON.stringify(mockQuery())]: {
            isFetching: true,
            didInvalidate: false,
            error: null
          }
        },
        {
          type: RECEIVE_FAILUER,
          query: mockQuery(),
          error
        }
      )
    ).toEqual({
      [JSON.stringify(mockQuery())]: {
        isFetching: false,
        didInvalidate: false,
        error
      }
    });
  });
});
