// @flow
import * as React from 'react';
import { style } from 'typestyle';

import { withTheme } from '@material-ui/core/styles';
import WorkList from '../containers/WorkList';
import type { StateProps, DispatchProps } from '../containers/Pickup';

const getCn = props => ({
  root: style({
    padding: props.theme.spacing.unit * 4
  })
});

export type Props = StateProps & DispatchProps;

export default withTheme()((props: Props) => {
  const dcn = getCn(props);
  const { pickup } = props;

  return (
    <div className={dcn.root}>
      <WorkList
        works={pickup}
        title="ピックアップステージ"
        more
        moreLink=""
        showVisibility={false}
      />
    </div>
  );
});
