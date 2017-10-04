import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const style = {};

class User extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  render() {
    const { classes, match: { params } } = this.props;
    return <div>User page of {params.user}</div>;
  }
}

export default withStyles(style)(User);
