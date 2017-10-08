import { RECEIVE_DOCUMENTS } from '../actions';

const docToPlaneObject = doc => {
  return {
    id: doc.id,
    ...doc.data()
  };
};

const documents = (state = [], action) => {
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
      const key = action.query.collectionPath;
      return {
        ...state,
        [key]: documents(state[key], action)
      };
    default:
      return state;
  }
};
