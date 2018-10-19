// @flow
import { type Theme } from '@material-ui/core/styles/createMuiTheme';
import theme from '../settings/theme';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'theme';

export type Action = {};

export type State = Theme;

const initialState: State = theme;

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};
