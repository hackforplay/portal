import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button/Button';

import googleIcon from '../resources/google.svg';

type Props = {
  classes: {
    blank: string,
    icon: string
  }
};

type State = {
  anchorEl: ?HTMLElement
};

@withStyles({
  blank: {
    flex: 1
  },
  icon: {
    width: 18,
    marginRight: 12
  }
})
class Header extends React.Component<Props, State> {
  static propTyeps = {
    classes: PropTypes.object.isRequired
  };

  state = {
    anchorEl: null
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
          >
            ログイン
          </Button>
          <Popover
            id="simple-menu"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>
              <img src={googleIcon} alt="G" className={classes.icon} />
              <Typography type="button">Google でログイン</Typography>
            </MenuItem>
          </Popover>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
