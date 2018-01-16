import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

type Props = {
  classes: {}
} & ContextRouter;

@withStyles({})
class Work extends React.Component<Props> {
  render() {
    const { classes, match } = this.props;
    return <div>{match.params.id}</div>;
  }
}

export default Work;
