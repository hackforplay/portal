// @flow
import * as React from 'react';
import { css } from 'emotion';

import WorkList from '../containers/WorkList';
import theme from '../settings/theme';
import { type StateProps } from '../containers/SearchList';

const classes = {
  root: css({
    padding: theme.spacing.unit * 4
  })
};

export type OwnProps = {};

type Props = OwnProps & StateProps;

export default (props: Props) => {
  const { result } = props;

  return (
    <div className={classes.root}>
      <WorkList works={result} title="検索結果" more moreLink="" />
    </div>
  );
};
