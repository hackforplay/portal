// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import WorkList from '../containers/WorkList';
import type { WorkCollectionType } from '../ducks/work';

export type Props = {
  classes: {
    root: string
  },
  lists: {
    recommended: WorkCollectionType,
    trending: WorkCollectionType
  }
} & ContextRouter;

@withStyles({
  root: {
    padding: theme.spacing.unit * 4
  }
})
export default class FeatureLists extends React.Component<Props> {
  render() {
    const { classes, match, lists } = this.props;

    // 現在の URL に対して適切なデータを表示
    const more = match.params.more;
    return (
      <div className={classes.root}>
        <WorkList
          works={lists.trending}
          title="人気の作品"
          more={more === 'trending'}
          moreLink="/lists/trending"
        />
        <WorkList
          works={lists.recommended}
          title=/*"おすすめの作品"*/"あたらしい作品"
          more={more === 'recommended'}
          moreLink="/lists/recommended"
        />
      </div>
    );
  }
}
