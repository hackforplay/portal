import React from 'react';
import Button from 'material-ui/Button';
import { css, cx } from 'emotion';
import { withTheme } from 'material-ui/styles';

const getCn = props => ({
  root: css({
    color:
      props.color !== 'secondary'
        ? props.theme.palette.primary.contrastText
        : props.theme.palette.secondary.contrastText
  })
});

export default withTheme()(props => {
  const dcn = getCn(props);
  const { className, ...others } = props;
  return <Button className={cx(dcn.root, className)} {...others} />;
});
