// @flow
import * as React from 'react';
import { css } from 'emotion';

import WorkList from '../containers/WorkList';
import theme from '../settings/theme';

export type OwnProps = *;

const rootStyle = css({
  padding: theme.spacing.unit * 4
});

export default class SearchList extends React.Component<OwnProps> {
  render() {
    const { result } = this.props;

    return (
      <div className={rootStyle}>
        <WorkList works={result} title="検索結果" more moreLink="" />
      </div>
    );
  }
}
