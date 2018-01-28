// @flow
/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers } from 'redux';

import * as auth from './auth';
import type { State as AuthState } from './auth';
import * as work from './work';
import type { State as WorkState } from './work';
import * as user from './user';
import type { State as UserState } from './user';

const reducer = combineReducers({
  [auth.storeName]: auth.default,
  [work.storeName]: work.default,
  [user.storeName]: user.default
});

// TODO: auth, work などのキーワードを二度定義している. 型チェックすべき
export type StoreState = {
  auth: AuthState,
  work: WorkState,
  user: UserState
};

export default reducer;
