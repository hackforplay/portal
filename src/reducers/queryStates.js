import {
  INVALIDATE_QUERY,
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  RECEIVE_FAILUER
} from '../constants/actionTypes';

const errorToPlaneObject = error => ({
  message: error.message
});

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
    case REQUEST_DOCUMENTS:
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
        error: errorToPlaneObject(action.error)
      };
    default:
      return state;
  }
};

export const queryStates = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_QUERY:
    case REQUEST_DOCUMENTS:
    case RECEIVE_DOCUMENTS:
    case RECEIVE_FAILUER:
      const { canonical } = action;
      return {
        ...state,
        [canonical]: queryState(state[canonical], action)
      };
    default:
      return state;
  }
};
