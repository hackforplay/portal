// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
// import Paper from 'material-ui/Paper';
import { style } from 'typestyle';

import WorkList from '../containers/WorkList';
import theme from '../settings/theme';
import type { StateProps, DispatchProps } from '../containers/UserWorks';

const cn = {
  root: style({
    padding: theme.spacing.unit * 4
  })
};

export type Props = StateProps & DispatchProps & { ...ContextRouter };

export default ({ match, works }: Props) => {
  // 現在の URL に対して適切なデータを表示
  const id = match.params.id || '';
  const tab = match.params.tab || '';
  return (
    <div className={cn.root}>
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
};
