// @flow
/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers } from 'redux';

import * as auth from './auth';
import type { State as AuthState, Action as AuthAction } from './auth';
import * as work from './work';
import type { State as WorkState, Action as WorkAction } from './work';
import * as officialWork from './officialWork';
import type {
  State as OfficialWorkState,
  Action as OfficialWorkAction
} from './officialWork';
import * as make from './make';
import type { State as MakeState, Action as MakeAction } from './make';
import * as user from './user';
import type { State as UserState, Action as UserAction } from './user';
import * as pcRanking from './pcRanking';
import type {
  State as PCRankingState,
  Action as PCRankingAction
} from './pcRanking';
import * as storage from './storage';
import type { State as StorageState, Action as StorageAction } from './storage';

const reducer = combineReducers({
  [auth.storeName]: auth.default,
  [work.storeName]: work.default,
  [officialWork.storeName]: officialWork.default,
  [make.storeName]: make.default,
  [user.storeName]: user.default,
  [pcRanking.storeName]: pcRanking.default,
  [storage.storeName]: storage.default
});

// TODO: auth, work などのキーワードを二度定義している. 型チェックすべき
export type StoreState = {|
  +auth: AuthState,
  +work: WorkState,
  +officialWork: OfficialWorkState,
  +make: MakeState,
  +user: UserState,
  +pcRanking: PCRankingState,
  +storage: StorageState
|};

type ReduxResetAction = {
  type: 'RESET',
  state?: StoreState
};

/* eslint-disable no-use-before-define */
export type Action =
  | WorkAction
  | OfficialWorkAction
  | MakeAction
  | StorageAction
  | AuthAction
  | UserAction
  | PCRankingAction
  | ReduxResetAction;
export type Dispatch = (
  action: Action | ThunkAction | PromiseAction
) => void | Promise<void>;
export type ThunkAction = (
  dispatch: Dispatch,
  getState: GetState
) => void | Promise<void>;
export type GetState = () => StoreState;
export type PromiseAction = Promise<Action>;
/* eslint-enable no-use-before-define */

export default reducer;
