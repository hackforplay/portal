// @flow
import type { State as AuthState, Action as AuthAction } from './auth';
import type { State as WorkState, Action as WorkAction } from './work';
import type {
  State as OfficialWorkState,
  Action as OfficialWorkAction
} from './officialWork';
import type { State as MakeState, Action as MakeAction } from './make';
import type { State as UserState, Action as UserAction } from './user';
import type {
  State as PCRankingState,
  Action as PCRankingAction
} from './pcRanking';
import type { State as StorageState, Action as StorageAction } from './storage';
import type { State as MapsState, Action as MapsAction } from './maps';
import type { State as ThemeState, Action as ThemeAction } from './storage';

export type StoreState = {|
  +auth: AuthState,
  +work: WorkState,
  +officialWork: OfficialWorkState,
  +make: MakeState,
  +user: UserState,
  +pcRanking: PCRankingState,
  +storage: StorageState,
  +maps: MapsState,
  +theme: ThemeState
|};
export type GetStore = () => StoreState;

type ReduxResetAction = {
  type: 'RESET',
  state?: StoreState
};

export type Action =
  | WorkAction
  | OfficialWorkAction
  | MakeAction
  | StorageAction
  | MapsAction
  | AuthAction
  | UserAction
  | PCRankingAction
  | ThemeAction
  | ReduxResetAction;
/* eslint-disable no-use-before-define */
export type Dispatch = (
  action: Action | ThunkAction | PromiseAction
) => void | Promise<void>;
/* eslint-enable no-use-before-define */
export type ThunkAction = (
  dispatch: Dispatch,
  getState: GetStore
) => void | Promise<void>;
export type PromiseAction = Promise<Action>;
