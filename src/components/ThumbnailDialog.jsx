// @flow
import * as React from 'react';
import classNames from 'classnames';
import Dialog from 'material-ui/Dialog/Dialog';
import { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import GridList from 'material-ui/GridList/GridList';
import { GridListTile } from 'material-ui/GridList';
import Button from 'material-ui/Button';
import { css } from 'emotion';

import theme from '../settings/theme';
import type { StateProps, DispatchProps } from '../containers/ThumbnailDialog';

const classes = {
  content: css({
    maxWidth: 600
  }),
  gridList: css({
    margin: 0
  }),
  gridItem: css({
    maxWidth: 184,
    minWidth: 184,
    marginBottom: 2 // border が見えるように
  }),
  selectedTile: css({
    borderColor: theme.palette.primary[500],
    borderStyle: 'solid',
    borderWidth: 2
  })
};

export type OwnProps = {
  open: boolean,
  src?: string,
  onClose: () => void
};

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  selectedIndex: number | null
};

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
    const { make, open, src, onClose } = this.props;

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
