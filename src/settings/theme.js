import { createMuiTheme } from 'material-ui/styles';
import { orange } from 'material-ui/colors';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    // 標準のアルゴリズムでは orange のコントラストカラーは black になってしまうので閾値を変える
    contrastThreshold: 2.1
  },
  overrides: {
    MuiCardHeader: {
      root: {
        padding: 4
      }
    },
    MuiCardMedia: {
      root: {
        borderRadius: 2
      }
    },
    MuiCardContent: {
      root: {
        padding: 4
      }
    }
  }
});

export default theme;
