import { RECEIVE_DOCUMENTS } from '../constants/actionTypes';

const docToPlaneObject = doc => {
  return {
    id: doc.id,
    ...doc.data()
  };
};

// TODO: Exclude document having same id of other one.
export const documents = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DOCUMENTS:
      return state.concat(action.docs.map(docToPlaneObject));
    default:
      return state;
  }
};

export const collections = (
  state = {
    users: [],
    products: []
  },
  action
) => {
  switch (action.type) {
    case RECEIVE_DOCUMENTS:
      const { path } = action;
      if (!state[path]) {
        // Invalid collection path
        throw new Error(`Collection '${path}' is not found`);
      }
      return {
        ...state,
        [path]: documents(state[path], action)
      };
    default:
      return state;
  }
};
