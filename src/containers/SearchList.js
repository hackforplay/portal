// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';
import { searchWorks } from '../ducks/work';
import type { WorkCollectionType } from '../ducks/work';
import type { StoreState } from '../ducks';

import SearchList from '../components/SearchList';
import type { OwnProps } from '../components/SearchList';

export type StateProps = {
  query: string,
  result: WorkCollectionType
};

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => {
  const { query, result } = state.work.search;

  return {
    query,
    result
  };
};

const mapDispatchToProps = {
  searchWorks
};

type Props = OwnProps &
  StateProps &
  typeof mapDispatchToProps & { ...ContextRouter };

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
