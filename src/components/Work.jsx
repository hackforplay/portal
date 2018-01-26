import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

import type { Work as WorkType } from '../ducks/work';

type Props = {
  classes: {
    blank: string
  },
  work: WorkType
} & ContextRouter;

type State = {
  anchorEl: ?HTMLElement,
  rootEl: ?HTMLElement
};

@withStyles({
  blank: {
    flex: 1
  }
})
class Work extends React.Component<Props, State> {
  state = {
    anchorEl: null,
    rootEl: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.rootEl && prevState.rootEl !== this.state.rootEl) {
      console.log(this.state.rootEl);
    }
  }

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, work } = this.props;
    const { anchorEl } = this.state;

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography type="headline">{work.title}</Typography>
          <div className={classes.blank} />
          <Button>セーブ</Button>
          <Button>シェア</Button>
          <Button
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            その他
          </Button>
          <Popover
            id="simple-menu"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>なにかする</MenuItem>
          </Popover>
        </Toolbar>
        <div
          ref={rootEl =>
            this.state.rootEl ||
            (console.log('ref', rootEl) || this.setState({ rootEl }))
          }
        />
      </AppBar>
    );
  }
}

export default Work;
