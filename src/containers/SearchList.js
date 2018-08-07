// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';
import type { MapStateToProps, MapDispatchToProps } from 'react-redux';
import { searchWorks } from '../ducks/work';
import type { WorkCollectionType } from '../ducks/work';
import type { StoreState } from '../ducks';

import SearchList from '../components/SearchList';
import type { OwnProps } from '../components/SearchList';

export type StateProps = {
  query: string,
  result: WorkCollectionType
};

const mapStateToProps: MapStateToProps<StoreState, OwnProps, StateProps> = (
  state,
  ownProps
) => {
  const { query, result } = state.work.search;

  return {
    query,
    result
  };
};

export type DispatchProps = *;

const mapDispatchToProps: MapDispatchToProps<{}, OwnProps, DispatchProps> = (
  dispatch,
  ownProps
) => ({
  searchWorks
});

type Props = OwnProps & StateProps & DispatchProps & ContextRouter;

export default connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<Props> {
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
      return <SearchList {...this.props} />;
    }
  }
);
