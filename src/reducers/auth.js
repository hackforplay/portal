import { SIGN_IN, SIGN_OUT } from '../constants/actionTypes';

export const auth = (state = { initialized: false, user: null }, action) => {
  switch (action.type) {
    case SIGN_IN:
      const { user } = action;
      return { ...state, initialized: true, user };
    case SIGN_OUT:
      return { ...state, initialized: true, user: null };
    default:
      return state;
  }
};
