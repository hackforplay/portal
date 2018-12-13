// @flow
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import { actions, executeAutoSave } from '../ducks/make';
import type { StoreState } from '../ducks/';

const mapStateToProps = (state: StoreState, ownProps) => ({
  value: state.make.metadata.title || ''
});

const mapDispatchToProps = {
  onChange: event => dispatch => {
    dispatch(
      actions.metadata({
        title: event.target.value
      })
    );
    dispatch(executeAutoSave()); // debounce してオートセーブ
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);
