import * as React from 'react';
import classNames from 'classnames';
import Dialog from 'material-ui/Dialog/Dialog';
import { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import GridList from 'material-ui/GridList/GridList';
import { GridListTile } from 'material-ui/GridList';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import type {
  saveWorkType,
  setThumbnailFromDataURLType,
  State as MakeState
} from '../ducks/make';

type Props = {
  saveWork: saveWorkType,
  setThumbnailFromDataURL: setThumbnailFromDataURLType,
  classes: {
    content: string,
    gridItem: string,
    selectedTile: string
  },
  make: MakeState,
  src?: string
};

type State = {
  selectedIndex: ?number
};

@withStyles({
  content: {
    maxWidth: 600
  },
  gridList: {
    margin: 0
  },
  gridItem: {
    maxWidth: 184,
    minWidth: 184,
    marginBottom: 2 // border が見えるように
  },
  selectedTile: {
    borderColor: theme.palette.primary[500],
    borderStyle: 'solid',
    borderWidth: 2
  }
})
export default class ThumbnailDialog extends React.Component<Props, State> {
  state = {
    // Index of make.thumbnails
    selectedIndex: null
  };

  handleSetThumbnail = async () => {
    const { selectedIndex } = this.state;
    this.props.onClose();
    if (selectedIndex !== null) {
      const dataUrl = this.props.make.thumbnails[selectedIndex];
      if (dataUrl) {
        await this.props.setThumbnailFromDataURL(dataUrl);
        await this.props.saveWork();
      }
    }
  };

  render() {
    const { classes, make, open, src, onClose } = this.props;

    const tiles = make.thumbnails.map((src, i) => (
      <GridListTile
        key={src}
        cols={1}
        classes={{
          root: classes.gridItem,
          tile: classNames({
            [classes.selectedTile]: this.state.selectedIndex === i
          })
        }}
        onClick={() => {
          this.setState({
            selectedIndex: i
          });
        }}
      >
        <img src={src} alt={src.substr(0, 10)} />
      </GridListTile>
    ));

    if (src) {
      tiles.unshift(
        <GridListTile
          key={src}
          cols={1}
          classes={{
            root: classes.gridItem,
            tile: classNames({
              [classes.selectedTile]: this.state.selectedIndex === null
            })
          }}
          onClick={() => {
            this.setState({
              selectedIndex: null
            });
          }}
        >
          <img src={src} alt="Current" />
        </GridListTile>
      );
    }

    // タイルの数が少なければ column も減らす
    const cols = Math.min(3, tiles.length);

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>カバー画像をセットしよう</DialogTitle>
        <DialogContent className={classes.content}>
          <GridList cols={cols} className={classes.gridList}>
            {tiles}
          </GridList>
        </DialogContent>
        <DialogActions>
          <Button
            raised
            color="primary"
            disabled={this.state.selectedIndex === null}
            onClick={this.handleSetThumbnail}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
