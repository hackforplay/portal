import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';

import theme from '../settings/theme';
import { optionalHeaderInfo } from '../settings/siteMap';

type Props = {
  classes: {}
} & ContextRouter;

@withRouter
@withStyles({
  root: {
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 6,
    backgroundColor: grey[300]
  }
})
class OptionalHeader extends React.Component<Props> {
  render() {
    const { classes, location } = this.props;

    // 現在表示している URL にふさわしいタブの状態を取得する
    const info = optionalHeaderInfo.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!info) {
      // TODO: アニメーション
      return null;
    }

    return (
      <div className={classes.root}>
        <Typography align="center" type="headline" gutterBottom>
          {info.headline}
        </Typography>
        <Typography align="center" type="caption">
          {info.caption}
        </Typography>
      </div>
    );
  }
}

export default OptionalHeader;
