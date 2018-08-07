// @flow
import * as React from 'react';
import { withStyles } from 'material-ui/styles';

import WorkList from '../containers/WorkList';
import theme from '../settings/theme';
import type { WorkCollectionType } from '../ducks/work';

type Props = {
  classes: {
    root: string
  },
  query: string,
  result: WorkCollectionType
};

@withStyles({
  root: {
    padding: theme.spacing.unit * 4
  }
})
export default class SearchList extends React.Component<Props> {
  render() {
    const { classes, result } = this.props;

    return (
      <div className={classes.root}>
        <WorkList works={result} title="検索結果" more moreLink="" />
      </div>
    );
  }
}
