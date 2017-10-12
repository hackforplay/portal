import { RECEIVE_DOCUMENTS } from '../constants/actionTypes';

const docToPlaneObject = doc => {
  return {
    id: doc.id,
    ...doc.data()
  };
};

export const documents = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DOCUMENTS:
      const docs = action.docs.map(docToPlaneObject);
      // Replace item which has same id to the docs
      return state
        .filter(item => docs.every(doc => doc.id !== item.id))
        .concat(docs);
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
