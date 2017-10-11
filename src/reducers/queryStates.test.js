import randomstring from 'randomstring';

import { queryStates as reducer } from './queryStates';
import {
  INVALIDATE_QUERY,
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../constants/actionTypes';

const mockCanonical = jest.fn(() => randomstring.generate('10'));

describe('queryStates reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle INVALIDATE_QUERY', () => {
    const canonical = mockCanonical();
    expect(
      reducer(
        {
          [canonical]: {
            isFetching: false,
            didInvalidate: false,
            error: null
          }
        },
        {
          type: INVALIDATE_QUERY,
          canonical
        }
      )
    ).toEqual({
      [canonical]: {
        isFetching: false,
        didInvalidate: true,
        error: null
      }
    });
  });

  it('should handle REQUEST_DOCUMENTS', () => {
    const canonical = mockCanonical();
    expect(
      reducer(undefined, {
        type: REQUEST_DOCUMENTS,
        canonical
      })
    ).toEqual({
      [canonical]: {
        isFetching: true,
        didInvalidate: false,
        error: null
      }
    });
  });

  it('should handle RECEIVE_DOCUMENTS', () => {
    const canonical = mockCanonical();
    expect(
      reducer(
        {
          [canonical]: {
            isFetching: true,
            didInvalidate: false,
            error: null
          }
        },
        {
          type: RECEIVE_DOCUMENTS,
          canonical
        }
      )
    ).toEqual({
      [canonical]: {
        isFetching: false,
        didInvalidate: false,
        error: null
      }
    });
  });

  it('should handle RECEIVE_FAILUER', () => {
    const canonical = mockCanonical();
    const error = new Error('Error');
    expect(
      reducer(
        {
          [canonical]: {
            isFetching: true,
            didInvalidate: false,
            error: null
          }
        },
        {
          type: RECEIVE_FAILUER,
          canonical,
          error
        }
      )
    ).toEqual({
      [canonical]: {
        isFetching: false,
        didInvalidate: false,
        error: {
          message: error.message
        }
      }
    });
  });
});
