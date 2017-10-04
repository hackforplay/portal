import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { firebase } from '../firebase-utils';

const style = {
  item: {
    textAlign: 'center'
  }
};

class Products extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    products: []
  };

  async componentDidMount() {
    try {
      const db = firebase.database();
      const snapshot = await db.ref('/products').once('value');
      this.setState({ products: snapshot.val() });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  render() {
    const { classes } = this.props;
    const { products } = this.state;

    return products.map((product, i) => (
      <div key={i} className={classes.item}>
        {JSON.stringify(product)}
      </div>
    ));
  }
}

export default withStyles(style)(Products);
