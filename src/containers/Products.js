// @flow
import { connect } from 'react-redux';

import { collection, request, isFetching } from '../actions';
import Products from '../components/Products';

const query = collection('products');

const mapStateToProps = state => {
  return {
    products: state.collections.products,
    isFetching: isFetching(state, query)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleLoad: () => {
      dispatch(request(query));
    }
  };
};

const AllProducts = connect(mapStateToProps, mapDispatchToProps)(Products);
export default AllProducts;
