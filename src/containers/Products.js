import { connect } from 'react-redux';

import { requestDocuments } from '../actions';
import Products from '../components/Products';

const query = {
  collectionPath: 'products'
};
const queryJson = JSON.stringify(query);

const mapStateToProps = state => {
  const queryInfo = state.queryStates[queryJson] || {
    isFetching: true
  };
  return {
    products: state.collections.products,
    isFetching: queryInfo.isFetching
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleLoad: () => {
      dispatch(requestDocuments(query));
    }
  };
};

const AllProducts = connect(mapStateToProps, mapDispatchToProps)(Products);
export default AllProducts;
