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

import Header from '../containers/Header';
import Auth from '../containers/Auth';
import UserMenu from '../containers/UserMenu';
import User from '../containers/User';
import Products from '../containers/Products';
import Topic from '../containers/Topic';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleLoad: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.handleLoad();
  }

  render() {
    return (
      <Router>
        <div>
          <Route component={Header} />
          <Route path="/" component={Topic} />
          <Route path="/auth" component={Auth} />
          <Route path="/products" component={Products} />
          <Route strict path="/users/:user" component={User} />
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
