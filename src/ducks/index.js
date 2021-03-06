// @flow
/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers } from 'redux';

import * as auth from './auth';
import * as work from './work';
import * as officialWork from './officialWork';
import * as make from './make';
import * as user from './user';
import * as pcRanking from './pcRanking';
import * as storage from './storage';
import * as maps from './maps';
import * as theme from './theme';

export default combineReducers({
  auth: auth.default,
  work: work.default,
  officialWork: officialWork.default,
  make: make.default,
  user: user.default,
  pcRanking: pcRanking.default,
  storage: storage.default,
  maps: maps.default,
  theme: theme.default
});

export * from './type';
