// @flow
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import { actions } from '../ducks/make';
import type { StoreState } from '../ducks/';

const mapStateToProps = (state: StoreState, ownProps) => ({
  value: state.make.metadata.title || ''
});

const mapDispatchToProps = {
  onChange: event => dispatch =>
    dispatch(
      actions.metadata({
        title: event.target.value
      })
    )
};

export default connect(mapStateToProps, mapDispatchToProps)(TextField);
