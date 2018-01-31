import * as React from 'react';
import { ContextRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import { WorkList } from '../components/WorkLists';
import type { Work } from '../ducks/work';
import theme from '../settings/theme';

export type Props = {
  classes: {
    root: string
  },
  lists: {
    public: Array<Work>,
    private: Array<Work> //,
    // likes: Array<Work>
  }
} & ContextRouter;

@withStyles({
  root: {
    padding: theme.spacing.unit * 4
  }
})
class UserWorks extends React.Component<Props> {
  render() {
    const { classes, match, lists } = this.props;

    // 現在の URL に対して適切なデータを表示
    const { id, tab } = match.params;
    return (
      <div className={classes.root}>
        {tab === undefined ? (
          <WorkList
            works={lists.public}
            title="公開済み"
            moreLink={`/users/${id}`}
          />
        ) : tab === 'private' ? (
          <WorkList
            works={lists.private}
            title="保存済み"
            moreLink={`/users/${id}/private`}
          />
        ) : tab === 'likes' ? (
          <WorkList
            works={lists.likes}
            title="お気に入り"
            moreLink={`/users/${id}/likes`}
          />
        ) : tab === 'following' ? (
          <Paper>フォロー</Paper>
        ) : tab === 'followers' ? (
          <Paper>フォロワー</Paper>
        ) : null}
      </div>
    );
  }
}

export default UserWorks;
