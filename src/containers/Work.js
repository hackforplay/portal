import { connect } from 'react-redux';
import Work from '../components/Work';

const mapStateToProps = (state, ownProps) => {
  const work = {
    title: 'おもしろいゲーム'
  };
  return {
    work
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Work);
