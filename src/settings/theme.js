// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';

const theme = createMuiTheme({
  palette: {
    primary: deepOrange
  },

  typography: {
    fontWeightMedium: 600
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
