// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
// import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import WorkList from '../containers/WorkList';
import type { WorkCollectionType } from '../ducks/work';
import theme from '../settings/theme';

export type Props = {
  classes: {
    root: string
  },
  works: WorkCollectionType
} & ContextRouter;

@withStyles({
  root: {
    padding: theme.spacing.unit * 4
  }
})
class UserWorks extends React.Component<Props> {
  render() {
    const { classes, match, works } = this.props;

    // 現在の URL に対して適切なデータを表示
    const id = match.params.id || '';
    const tab = match.params.tab || '';
    return (
      <div className={classes.root}>
        {tab === '' ? (
          <WorkList
            works={works}
            title="ステージ"
            more
            moreLink={`/users/${id}`}
            showVisibility
          />
        ) : /* tab === 'likes' ? (
          <WorkList
            works={}
            title="お気に入り"
            moreLink={`/users/${id}/likes`}
          />
        ) : tab ===
        'following' ? (
          <Paper>フォロー</Paper>
        ) : tab === 'followers' ? (
          <Paper>フォロワー</Paper>
        ) :*/ null}
      </div>
    );
  }
}

export default UserWorks;
