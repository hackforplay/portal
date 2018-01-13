/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers } from 'redux';

import * as auth from './auth';

const reducer = combineReducers({
  [auth.storeName]: auth.default,
});

export default reducer;
