import { connect } from 'react-redux';

import { init } from '../actions';
import App from '../components/App';

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleLoad() {
      dispatch(init());
    }
  };
};

const RootApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default RootApp;

// サインインしてたらそもそも Auth は表示されない
// components/Auth.js から how it works なコードをすべて排除
