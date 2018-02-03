// @flow
import * as React from 'react';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import WorkList from '../containers/WorkList';
import type { WorkCollectionType } from '../ducks/work';

export type Props = {
  classes: {
    root: string
  },
  pickup: WorkCollectionType
};

@withStyles({
  root: {
    padding: theme.spacing.unit * 4
  }
})
export default class Pickup extends React.Component<Props> {
  render() {
    const { classes, pickup } = this.props;

    return (
      <div className={classes.root}>
        <WorkList
          works={pickup}
          title="ピックアップステージ"
          more
          moreLink=""
        />
      </div>
    );
  }
}
