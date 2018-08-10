// @flow
import * as React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { css, cx } from 'emotion';

import theme from '../settings/theme';
import type { StateProps, DispatchProps } from '../containers/ThumbnailDialog';
import * as WorkList from './WorkList';

const classes = {
  root: css({
    backgroundColor: 'red',
    maxWidth: '100vw'
  }),
  content: css({
    maxWidth: '80vw'
  }),
  wrapper: css({
    display: 'flex',
    flexWrap: 'wrap'
  }),
  border: css({
    margin: 2,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'transparent',
    '&.selected': {
      borderColor: theme.palette.primary[500]
    }
  }),
  item: css({
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
        <DialogContent className={classes.content}>
          {src ? (
            // 現在のサムネイル
            <div
              className={cx(
                classes.border,
                this.state.selectedIndex === null && 'selected'
              )}
              onClick={() => {
                this.setState({
                  selectedIndex: null
                });
              }}
            >
              <div className={cx(WorkList.classes.thumbnail, classes.item)}>
                <img src={src} alt="今のサムネイル" />
              </div>
            </div>
          ) : null}
          <div className={classes.wrapper}>
            {make.thumbnails.map((src, i) => (
              <div
                key={i}
                className={cx(
                  classes.border,
                  this.state.selectedIndex === i && 'selected'
                )}
                onClick={() => {
                  this.setState({
                    selectedIndex: i
                  });
                }}
              >
                <div className={cx(WorkList.classes.thumbnail, classes.item)}>
                  <img src={src} alt="サムネイル" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            raised
            color="primary"
            size="large"
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
