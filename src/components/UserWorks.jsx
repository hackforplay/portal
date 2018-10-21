// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
// import Paper from '@material-ui/core/Paper';
import { style } from 'typestyle';

import WorkList from '../containers/WorkList';
import MapList from '../containers/MapList';
import { withTheme } from '@material-ui/core/styles';
import type { StateProps, DispatchProps } from '../containers/UserWorks';

const getCn = props => ({
  root: style({
    padding: props.theme.spacing.unit * 4
  })
});

export type Props = StateProps & DispatchProps & { ...ContextRouter };

export default withTheme()((props: Props) => {
  const dcn = getCn(props);
  const { match, works, maps } = props;
  // 現在の URL に対して適切なデータを表示
  const id = match.params.id || '';
  const tab = match.params.tab || '';
  return (
    <div className={dcn.root}>
      {tab === '' ? (
        <WorkList
          works={works}
          title="ステージ"
          more
          moreLink={`/users/${id}`}
          showVisibility
        />
      ) : tab === 'maps' ? (
        <MapList
          maps={maps}
          title="マップ"
          more
          moreLink={`/users/${id}/maps`}
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
});
