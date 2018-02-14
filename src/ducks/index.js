// @flow
/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers } from 'redux';

import * as auth from './auth';
import type { State as AuthState } from './auth';
import * as work from './work';
import type { State as WorkState } from './work';
import * as user from './user';
import type { State as UserState } from './user';
import * as pcRanking from './pcRanking';
import type { State as PCRankingState } from './pcRanking';
import * as storage from './storage';
import type { State as StorageState } from './storage';

const reducer = combineReducers({
  [auth.storeName]: auth.default,
  [work.storeName]: work.default,
  [user.storeName]: user.default,
  [pcRanking.storeName]: pcRanking.default,
  [storage.storeName]: storage.default
});

// TODO: auth, work などのキーワードを二度定義している. 型チェックすべき
export type StoreState = {
  auth: AuthState,
  work: WorkState,
  user: UserState,
  pcRanking: PCRankingState,
  storage: StorageState
};

export default reducer;
