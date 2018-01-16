// @flow
/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers } from 'redux';

import * as auth from './auth';
import * as work from './work';

const reducer = combineReducers({
  [auth.storeName]: auth.default,
  [work.storeName]: work.default
});

// TODO: auth, work などのキーワードを二度定義している. 型チェックすべき
export type StoreState = {
  auth: auth.State,
  work: work.State
};

export default reducer;
