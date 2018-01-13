// @flow
import { createMuiTheme } from 'material-ui/styles';
import orange from 'material-ui/colors/orange';
import grey from 'material-ui/colors/grey';
import { dark, light } from 'material-ui/styles/createPalette';
import { getContrastRatio } from 'material-ui/styles/colorManipulator';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    // 標準のアルゴリズムでは orange のコントラストカラーは black になってしまうので
    // 計算部分をオーバーライドする
    // https://github.com/mui-org/material-ui/blob/v1-beta/src/styles/createPalette.js
    getContrastText(background) {
      const contrastThreshold = /* 3.2 */ 2.1;
      // Use the same logic than
      // Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
      // and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
      const contrastText =
        getContrastRatio(background, dark.text.primary) >= contrastThreshold
          ? dark.text.primary
          : light.text.primary;

      return contrastText;
    },
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: grey[900],
      },
    },
  },
});

export default theme;
