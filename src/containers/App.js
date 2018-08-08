// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import App from '../components/App';
import { initializeAuth } from '../ducks/auth';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  initializeAuth
};

export type DispatchProps = typeof mapDispatchToProps;

type Props = DispatchProps;

export default connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<Props> {
    componentDidMount() {
      this.props.initializeAuth();
    }
    render() {
      return <App {...this.props} />;
    }
  }
);

// サインインしてたらそもそも Auth は表示されない
// components/Auth.js から how it works なコードをすべて排除
