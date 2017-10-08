import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import PropTypes from 'prop-types';

import Auth from '../containers/Auth';
import UserMenu from '../containers/UserMenu';
import User from '../containers/User';
import Products from '../containers/Products';

const styles = theme => ({
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleLoad: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.handleLoad();
  }

  render() {
    const { classes } = this.props;

    return (
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="contrast"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" className={classes.flex}>
                Title
              </Typography>
              <Route component={UserMenu} />
            </Toolbar>
          </AppBar>
          <Route path="/auth" component={Auth} />
          <Route path="/products" component={Products} />
          <Route strict path="/users/:user" component={User} />
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
