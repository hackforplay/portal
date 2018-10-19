// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { style } from 'typestyle';
import { withTheme } from '@material-ui/core/styles';

import WorkList from '../containers/WorkList';
import diamond_blue from '../resources/diamond_blue.png';
import diamond_green from '../resources/diamond_green.png';
import type { StateProps, DispatchProps } from '../containers/FeatureLists';

const cn = {
  title: style({
    display: 'inline-flex',
    alignItems: 'center'
  })
};
const getCn = props => ({
  root: style({
    padding: props.theme.spacing.unit * 3
  })
});

export type OwnProps = {};
export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

export default withTheme()((props: Props) => {
  const dcn = getCn(props);
  const { match, lists } = props;
  // 現在の URL に対して適切なデータを表示
  const more = match.params.more;
  return (
    <Grid container spacing={24} className={dcn.root}>
      <Grid item xs={12}>
        <WorkList
          works={lists.trending}
          title={
            <Typography variant="h6" gutterBottom className={cn.title}>
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
            <Typography variant="h6" gutterBottom className={cn.title}>
              <img src={diamond_green} alt="" />
              {/*"おすすめのステージ"*/}
              あたらしいステージ
            </Typography>
          }
          more={more === 'recommended'}
          moreLink="/lists/recommended"
          showVisibility={false}
        />
      </Grid>
    </Grid>
  );
});
