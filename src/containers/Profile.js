import { connect } from 'react-redux';
import Profile from '../components/Profile';

const mapStateToProps = (state, ownProps) => {
  // /users/:id の :id にあたる文字列
  const { id } = ownProps.match.params;

  return {
    user: {
      id,
      displayName: `User-${id}`
    }
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
