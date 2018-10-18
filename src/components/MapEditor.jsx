// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import type ReactMapEditorType from 'react-map-editor';
import { style, media } from 'typestyle';

import { type StateProps, type DispatchProps } from '../containers/MapEditor';

const cn = {
  root: style(
    {
      height: `calc(100vh - ${56 * 2}px)`
    },
    media(
      { minWidth: 0, orientation: 'landscape' },
      { height: `calc(100vh - ${48 * 2}px)` }
    ),
    media({ minWidth: 600 }, { height: `calc(100vh - ${64 * 2}px)` })
  ),
  flex: style({
    flexGrow: 1
  }),
  code: style({
    height: '5rem',
    width: '100%',
    fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
    overflow: 'scroll',
    backgroundColor: 'lightgrey',
    padding: 20,
    borderRadius: 2
  })
};

type State = {
  ReactMapEditor: ReactMapEditorType | null,
  tileset: any[],
  open: boolean,
  code: string
};

export type OwnProps = { ...ContextRouter };
type Props = OwnProps & StateProps & DispatchProps;

@withRouter
class MapEditor extends React.Component<Props, State> {
  state = {
    ReactMapEditor: null,
    tileset: [],
    open: false,
    code: ''
  };

  componentDidMount() {
    this.prepare();
  }

  async prepare() {
    const rme = await import('react-map-editor');
    const ReactMapEditor = rme.default;
    const response = await fetch(
      'https://hackforplay.github.io/pipoya-tiles/tileset.json'
    );
    const text = await response.text();
    const tileset = JSON.parse(text).tileSets;
    this.setState({
      ReactMapEditor,
      tileset
    });
  }

  showCode = () => {
    const { data } = this.props.mapDocument;
    if (!data) {
      this.setState({
        open: true,
        code: '保存すると、ここにコードが表示されます'
      });
      return;
    }
    this.setState({
      open: true,
      code: `
await Hack.loadMap(
  'map1',
  '${data.jsonUrl}'
);`.trim()
    });
  };

  saveNewMapJson = async () => {
    const json = JSON.stringify(window.root.export().map);
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    // 新規保存か、上書き保存か
    // 他の人のページを見ていることはないと想定する. id があれば上書き, そうでなければ新規
    // TODO: https://www.notion.so/teramotodaiki/Statefull-canUpdate-canDelete-component-d3dfc285dbaf4b10b446241fa72f5075
    if (this.props.match.params.id) {
      const path = `maps/${this.props.match.params.id}`;
      this.props.updateMapJson(json, dataUrl, path);
    } else {
      const id = await this.props.saveNewMapJson(json, dataUrl);
      if (id) {
        this.props.history.push(`/maps/${id}`);
      } else {
        alert('ほぞんにしっぱいしました');
      }
    }
  };

  closeCode = () => {
    this.setState({ open: false });
  };

  render() {
    const { isUploading } = this.props;
    const { ReactMapEditor, tileset } = this.state;

    if (!ReactMapEditor) {
      return <div>Loading...</div>;
    }

    if (this.props.mapState.isEmpty) {
      return <div>Not Found</div>;
    }
    if (this.props.mapState.isProcessing) {
      return <div>Loading Map Data...</div>;
    }
    if (this.props.mapState.isInvalid || !this.props.mapState.data) {
      return <div>Error</div>;
    }

    return (
      <div className={cn.root}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="inherit">
              マップエディタ（β版）
            </Typography>
            <div className={classes.flex} />
            <Button disabled={isUploading} onClick={this.saveNewMapJson}>
              保存する
            </Button>
            <Button onClick={this.showCode}>ステージに移す</Button>
          </Toolbar>
        </AppBar>
        <ReactMapEditor
          ref={ref => (window.root = ref)}
          tileset={tileset}
          map={this.props.mapState.data}
        />
        <CodeDialog
          open={this.state.open}
          code={this.state.code}
          requestClose={this.closeCode}
        />
      </div>
    );
  }
}

export default MapEditor;

type CodeDialogProps = {
  open: boolean,
  code: string,
  requestClose: () => void
};

export class CodeDialog extends React.Component<CodeDialogProps> {
  copyCode = () => {
    if (this.textarea) {
      this.textarea.select();
      document.execCommand('copy');
      alert('コピーされました！');
    }
  };

  textarea: HTMLTextAreaElement | null = null;

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.requestClose}>
        <DialogTitle id="alert-dialog-title">
          {'マップをコードに変換しました'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            このコードをコピーして、「Hack.changeMap('map1');」のすぐ上に書き足して下さい
          </DialogContentText>
          <textarea
            className={cn && cn.code}
            readOnly
            ref={ref => (this.textarea = ref)}
            wrap="off"
          >
            {this.props.code}
          </textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.copyCode} color="primary">
            コピー
          </Button>
          <Button onClick={this.props.requestClose} color="primary" autoFocus>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
