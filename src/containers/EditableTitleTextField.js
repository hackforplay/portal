import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

import { setMetadata } from '../ducks/make';
import type { StoreState } from '../ducks/';

const mapStateToProps = (state: StoreState, ownProps) => ({
  value: state.make.metadata.title || ''
});

const mapDispatchToProps = {
  onChange: event =>
    setMetadata({
      title: event.target.value
    })
};

export default connect(mapStateToProps, mapDispatchToProps)(TextField);
