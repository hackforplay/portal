// @flow
import * as React from 'react';
import { style } from 'typestyle';

import theme from '../settings/theme';
import WorkList from '../containers/WorkList';
import type { StateProps, DispatchProps } from '../containers/Pickup';

const cn = {
  root: style({
    padding: theme.spacing.unit * 4
  })
};

export type Props = StateProps & DispatchProps;

export default (props: Props) => {
  const { pickup } = props;

  return (
    <div className={cn.root}>
      <WorkList
        works={pickup}
        title="ピックアップステージ"
        more
        moreLink=""
        showVisibility={false}
      />
    </div>
  );
};
