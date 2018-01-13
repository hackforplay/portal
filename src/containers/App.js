import { connect } from 'react-redux';

import App from '../components/App';

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, props) => ({});

const RootApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default RootApp;

// サインインしてたらそもそも Auth は表示されない
// components/Auth.js から how it works なコードをすべて排除
