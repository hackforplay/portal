import React, { Component } from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class UserMenu extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    handleLoad: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    user: PropTypes.object
  };

  componentDidMount() {
    this.props.handleLoad();
  }

  render() {
    const { history, isFetching, user } = this.props;

    if (isFetching) return null;

    return user ? (
      user.display_name
    ) : (
      <Button color="contrast" onClick={() => history.push('/auth')}>
        Sign in
      </Button>
    );
  }
}

export default withRouter(UserMenu);
