// @flow
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { style, classes } from 'typestyle';

import { withTheme } from '@material-ui/core/styles';
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
  item: style({
    height: 160
  })
};
const getCn = props => ({
  border: style({
    margin: 2,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'transparent',
    $nest: {
      '&.selected': {
        borderColor: props.theme.palette.primary[500]
      }
    }
  })
});

export type OwnProps = {
  open: boolean,
  src?: string,
  onClose: () => void
};

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  selectedIndex: number | null
};

@withTheme()
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
    const dcn = getCn(this.props);
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
                  dcn.border,
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
                  dcn.border,
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
            variant="contained"
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
