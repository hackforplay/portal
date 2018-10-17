import React from 'react';
import Button from 'material-ui/Button';
import { style, classes } from 'typestyle';
import { withTheme } from 'material-ui/styles';

const getCn = props => ({
  root: style({
    color:
      props.color !== 'secondary'
        ? props.theme.palette.primary.contrastText
        : props.theme.palette.secondary.contrastText
  })
});

export default withTheme()(props => {
  const dcn = getCn(props);
  const { className, ...others } = props;
  return <Button className={classes(dcn.root, className)} {...others} />;
});
