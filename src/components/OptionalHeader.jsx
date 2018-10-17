// @flow
import * as React from 'react';
import { compose } from 'redux';
import pathToRegexp from 'path-to-regexp';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { grey } from 'material-ui/colors';
import { style } from 'typestyle';

import theme from '../settings/theme';
import { optionalHeaderInfo } from '../settings/siteMap';

const cn = {
  root: style({
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
    <div className={cn.root}>
      <Typography align="center" variant="headline" gutterBottom>
        {info.headline}
      </Typography>
      <Typography align="center" variant="caption">
        {info.caption}
      </Typography>
    </div>
  );
});
