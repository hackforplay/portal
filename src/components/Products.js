import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const style = {
  item: {
    textAlign: 'center'
  }
};

class Products extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    handleLoad: PropTypes.func.isRequired
  };

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
