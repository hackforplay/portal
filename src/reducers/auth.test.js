import { auth as reducer } from './auth';
import { SIGN_IN, SIGN_OUT } from '../actions';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ initialized: false, user: null });
  });

  it('should handle SIGN_IN and SIGN_OUT', () => {
    const user = {};
    let state = reducer(undefined, {
      type: SIGN_IN,
      user
    });

    expect(state).toEqual({
      initialized: true,
      user
    });

    state = reducer(state, {
      type: SIGN_OUT
    });

    expect(state).toEqual({
      initialized: true,
      user: null
    });
  });

  it('should handle SIGN_OUT', () => {
    const user = {};

    expect(
      reducer(undefined, {
        type: SIGN_OUT
      })
    ).toEqual({
      initialized: true,
      user: null
    });
  });
});
