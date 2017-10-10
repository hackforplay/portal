import {
  INVALIDATE_QUERY,
  REQUEST_QUERY,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../constants/actionTypes';

const queryState = (
  state = {
    isFetching: false,
    didInvalidate: false,
    error: null
  },
  action
) => {
  switch (action.type) {
    case INVALIDATE_QUERY:
      return {
        ...state,
        didInvalidate: true
      };
    case REQUEST_QUERY:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
        error: null
      };
    case RECEIVE_DOCUMENTS:
      return {
        ...state,
        isFetching: false
      };
    case RECEIVE_FAILUER:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
};

export const queryStates = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_QUERY:
    case REQUEST_QUERY:
    case RECEIVE_DOCUMENTS:
    case RECEIVE_FAILUER:
      const queryJson = JSON.stringify(action.query);
      return {
        ...state,
        [queryJson]: queryState(state[queryJson], action)
      };
    default:
      return state;
  }
};
