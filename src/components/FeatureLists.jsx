// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { css } from 'emotion';

import theme from '../settings/theme';
import WorkList from '../containers/WorkList';
import diamond_blue from '../resources/diamond_blue.png';
import diamond_green from '../resources/diamond_green.png';
import type { StateProps, DispatchProps } from '../containers/FeatureLists';

const classes = {
  root: css({
    padding: theme.spacing.unit * 3
  }),
  title: css({
    display: 'inline-flex',
    alignItems: 'center'
  })
};

export type OwnProps = {};
export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

export default ({ match, lists }: Props) => {
  // 現在の URL に対して適切なデータを表示
  const more = match.params.more;
  return (
    <Grid container spacing={24} className={classes.root}>
      <Grid item xs={12}>
        <WorkList
          works={lists.trending}
          title={
            <Typography type="title" gutterBottom className={classes.title}>
              <img src={diamond_blue} alt="" />
              人気のステージ
            </Typography>
          }
          more={more === 'trending'}
          moreLink="/lists/trending"
          showVisibility={false}
        />
      </Grid>
      <Grid item xs={12}>
        <WorkList
          works={lists.recommended}
          title={
            <Typography type="title" gutterBottom className={classes.title}>
              <img src={diamond_green} alt="" />
              {/*"おすすめのステージ"*/}あたらしいステージ
            </Typography>
          }
          more={more === 'recommended'}
          moreLink="/lists/recommended"
          showVisibility={false}
        />
      </Grid>
    </Grid>
  );
};
