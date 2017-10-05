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
      const db = firebase.firestore();
      const querySnapshot = await db.collection('products').get();
      this.setState({ products: querySnapshot.docs });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  render() {
    const { classes } = this.props;
    const { products } = this.state;

    return products.map((product, i) => (
      <div key={product.id} className={classes.item}>
        {JSON.stringify(product.data())}
      </div>
    ));
  }
}

export default withStyles(style)(Products);
