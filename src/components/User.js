import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const style = {
  name: {
    textAlign: 'center'
  }
};

class User extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleLoad: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    user: PropTypes.object
  };

  state = {
    user: null
  };

  componentDidMount() {
    this.props.handleLoad();
  }

  render() {
    const { classes, isFetching, user } = this.props;

    if (isFetching) return <div>Loading...</div>;
    return <div className={classes.name}>User page of {user.display_name}</div>;
  }
}

export default withStyles(style)(User);
