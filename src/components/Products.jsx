// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

const style = {
  item: {
    textAlign: 'center'
  }
};

class Products extends Component {
  state = {
    products: []
  };

  componentDidMount() {
    this.props.handleLoad();
  }

  render() {
    const { classes, products } = this.props;

    return products.map(product => (
      <div key={product.id} className={classes.item}>
        {JSON.stringify(product)}
      </div>
    ));
  }
}

export default withStyles(style)(Products);
