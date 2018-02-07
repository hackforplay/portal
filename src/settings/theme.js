import { createMuiTheme } from 'material-ui/styles';
import { deepOrange } from 'material-ui/colors';

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
