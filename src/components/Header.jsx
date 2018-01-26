import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button/Button';
import grey from 'material-ui/colors/grey';

import googleIcon from '../resources/google.svg';

type Props = {
  classes: {
    toolbar: string,
    blank: string,
    icon: string
  }
};

type State = {
  anchorEl: ?HTMLElement
};

@withStyles({
  toolbar: {
    backgroundColor: grey[900]
  },
  blank: {
    flex: 1
  },
  icon: {
    width: 18,
    marginRight: 12
  }
})
class Header extends React.Component<Props, State> {
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
        <Toolbar className={classes.toolbar}>
          <Typography type="title" color="inherit" component={Link} to="/">
            HackforPlay
          </Typography>
          <div className={classes.blank} />
          <Button color="contrast" component={Link} to="/contents/tutorial">
            チュートリアル
          </Button>
          <Button color="contrast" component={Link} to="/lists">
            ゲームプレイ
          </Button>
          <Button color="contrast" component={Link} to="/contents/kit">
            クリエイト
          </Button>
          <Button
            raised
            color="primary"
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
