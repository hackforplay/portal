import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Menu, { MenuItem } from 'material-ui/Menu';

import Button from 'material-ui/Button/Button';

type Props = {
  classes: {
    blank: string,
  },
};

type State = {
  anchorEl: ?HTMLElement,
};

@withStyles({
  blank: {
    flex: 1,
  },
})
class Header extends React.Component<Props, State> {
  static propTyeps = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" component={Link} to="/">
            HackforPlay
          </Typography>
          <div className={classes.blank} />
          <Button color="contrast" component={Link} to="/contents/tutorials">
            チュートリアル
          </Button>
          <Button color="contrast" component={Link} to="/lists">
            プレイする
          </Button>
          <Button color="contrast" component={Link} to="/contents/kits">
            ゲームを作る
          </Button>
          <Button
            color="contrast"
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          />
          <Menu>
            <MenuItem onClick={this.handleClose}>Google</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
