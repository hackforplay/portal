import { combineReducers } from 'redux';

import { queryStates } from './queryStates';
import { collections } from './collections';
import { auth } from './auth';

export default combineReducers({
  auth,
  queryStates,
  collections
});
