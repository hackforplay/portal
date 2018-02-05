// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';

import WrappedSearchList from '../components/SearchList';
import type { StoreState } from '../ducks';
import { searchWorks } from '../ducks/work';

const mapStateToProps = (state: StoreState, ownProps) => {
  const { query, result } = state.work.search;

  return {
    query,
    result
  };
};

const mapDispatchToProps = {
  searchWorks
};

type Props = typeof mapDispatchToProps & ContextRouter;

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchList extends React.Component<Props> {
  componentDidMount() {
    // /list/search/:query の :query にあたる文字列
    const { query } = this.props.match.params;

    this.props.searchWorks(query);
  }

  componentDidUpdate(prevProps: Props) {
    // /list/search/:query の :query にあたる文字列
    const { query } = this.props.match.params;

    if (query !== prevProps.match.params.query) {
      this.props.searchWorks(query);
    }
  }

  render() {
    return <WrappedSearchList {...this.props} />;
  }
}
