import * as React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import Auth from '../containers/Auth';
import UserMenu from '../containers/UserMenu';
import User from '../containers/User';
import Products from '../containers/Products';
import Button from 'material-ui/Button/Button';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  borderLeft: {
    borderLeft: '1px solid white',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Header extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            HackforPlay
          </Typography>
          <Button color="contrast">チュートリアル</Button>
          <Button color="contrast">プレイする</Button>
          <Button color="contrast">ゲームを作る</Button>
          <Button color="contrast" className={classes.borderLeft}>
            ログイン
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
