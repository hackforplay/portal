// @flow
import * as React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { style, classes } from 'typestyle';

import theme from '../settings/theme';
import type { StateProps, DispatchProps } from '../containers/ThumbnailDialog';
import * as WorkList from './WorkList';
import * as xlasses from '../utils/xlasses';

const cn = {
  root: style({
    backgroundColor: 'red',
    maxWidth: '100vw'
  }),
  content: style({
    maxWidth: '80vw'
  }),
  wrapper: style({
    display: 'flex',
    flexWrap: 'wrap'
  }),
  border: style({
    margin: 2,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'transparent',
    '&.selected': {
      borderColor: theme.palette.primary[500]
    }
  }),
  item: style({
    height: 160
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

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle>カバー画像をセットしよう</DialogTitle>
        <DialogContent className={cn.content}>
          <div className={cn.wrapper}>
            {src ? (
              // 現在のサムネイル
              <div
                className={classes(
                  cn.border,
                  this.state.selectedIndex === null && 'selected'
                )}
                onClick={() => {
                  this.setState({
                    selectedIndex: null
                  });
                }}
              >
                <div className={classes(WorkList.cn.thumbnail, cn.item)}>
                  <img src={src} alt="今のサムネイル" />
                </div>
              </div>
            ) : null}
            {make.thumbnails.map((src, i) => (
              <div
                key={i}
                className={classes(
                  cn.border,
                  this.state.selectedIndex === i && 'selected'
                )}
                onClick={() => {
                  this.setState({
                    selectedIndex: i
                  });
                }}
              >
                <div className={classes(WorkList.cn.thumbnail, cn.item)}>
                  <img src={src} alt="サムネイル" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="raised"
            color="primary"
            disabled={this.state.selectedIndex === null}
            onClick={this.handleSetThumbnail}
            className={xlasses.largeButton}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
