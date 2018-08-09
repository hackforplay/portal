// @flow
import * as React from 'react';
import { compose } from 'redux';
import pathToRegexp from 'path-to-regexp';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { grey } from 'material-ui/colors';
import { css } from 'emotion';

import theme from '../settings/theme';
import { optionalHeaderInfo } from '../settings/siteMap';

const classes = {
  root: css({
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 6,
    backgroundColor: grey[300]
  })
};

export type OwnProps = {};
type Props = OwnProps & { ...ContextRouter };

export default compose(withRouter)((props: Props) => {
  const { location } = props;

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
});
