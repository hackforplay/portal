// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { default as WrappedApp } from '../components/App';
import { initializeAuth } from '../ducks/auth';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  initializeAuth
};

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component {
  componentDidMount() {
    this.props.initializeAuth();
  }
  render() {
    return <WrappedApp {...this.props} />;
  }
}

export default App;

// サインインしてたらそもそも Auth は表示されない
// components/Auth.js から how it works なコードをすべて排除
