// @flow
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import debounce from 'debounce';

import { actions, saveWork } from '../ducks/make';
import type { StoreState } from '../ducks/';

const mapStateToProps = (state: StoreState, ownProps) => ({
  value: state.make.metadata.title || ''
});

// １秒間操作がなければ saveWork
const save = debounce(dispatch => dispatch(saveWork()), 1000);

const mapDispatchToProps = {
  onChange: event => dispatch => {
    dispatch(
      actions.metadata({
        title: event.target.value
      })
    );
    save(dispatch);
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);
