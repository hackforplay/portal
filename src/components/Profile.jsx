import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button/Button';

import theme from '../settings/theme';
import type { UserType } from '../ducks/auth';

type Props = {
  classes: {
    root: string
  },
  user?: UserType
};

@withStyles({
  root: {
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.appBar
  },
  avatar: {
    width: 80,
    height: 80,
    fontSize: '2.5rem',
    marginRight: theme.spacing.unit * 2
  },
  button: {
    marginBottom: theme.spacing.unit
  }
})
class Profile extends React.Component<Props> {
  render() {
    const { classes, user } = this.props;

    if (!user) {
      return (
        <div className={classes.root}>
          <Typography type="headline">ユーザーが見つかりません</Typography>
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={0} alignItems="center">
          <Grid item>
            <Avatar className={classes.avatar}>
              {user.displayName.substr(0, 1)}
            </Avatar>
          </Grid>
          <Grid item>
            <Grid container spacing={0}>
              <Grid item>
                <Typography type="headline">{user.displayName}</Typography>
              </Grid>
              {/* <Grid item>
                <Button raised color="primary" className={classes.button}>
                  編集する
                </Button>
              </Grid> */}
            </Grid>
            <Typography
              type="caption"
              align="left"
            >{`投稿数 ${56}`}</Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Profile;
