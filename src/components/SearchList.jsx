// @flow
import * as React from 'react';
import { style } from 'typestyle';

import WorkList from '../containers/WorkList';
import theme from '../settings/theme';
import { type StateProps } from '../containers/SearchList';

const cn = {
  root: style({
    padding: theme.spacing.unit * 4
  })
};

export type OwnProps = {};

type Props = OwnProps & StateProps;

export default (props: Props) => {
  const { result } = props;

  return (
    <div className={cn.root}>
      <WorkList
        works={result}
        title="検索結果"
        more
        moreLink=""
        showVisibility={false}
      />
    </div>
  );
};
