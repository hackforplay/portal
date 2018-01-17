import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router-dom';

class UserMenu extends Component {
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
