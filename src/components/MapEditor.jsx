// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Dialog from 'material-ui/Dialog/Dialog';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import type ReactMapEditorType from 'react-map-editor';
import { css } from 'emotion';

const cn = {
  root: css({
    height: `calc(100vh - ${56 * 2}px)`,
    '@media (min-width:0px) and (orientation: landscape)': {
      height: `calc(100vh - ${48 * 2}px)`
    },
    '@media (min-width:600px)': {
      height: `calc(100vh - ${64 * 2}px)`
    }
  }),
  flex: css({
    flexGrow: 1
  }),
  code: css({
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

export type OwnProps = {};
type Props = OwnProps & { ...ContextRouter };

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
    let code;
    try {
      code = `
await Hack.parseMapJson(
  'map1',
  \`${JSON.stringify(window.root.export().map)}\`
);`.trim();
    } catch (e) {
      code = `申し訳ございません。コードの生成に失敗しました😭 ${e.name}: ${
        e.message
      }`;
      console.error(e);
    }
    this.setState({ open: true, code });
  };

  closeCode = () => {
    this.setState({ open: false });
  };

  render() {
    const { ReactMapEditor, tileset } = this.state;

    if (!ReactMapEditor) {
      return <div>Loading...</div>;
    }

    return (
      <div className={cn.root}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="title" color="inherit">
              マップエディタ（β版）
            </Typography>
            <div className={cn.flex} />
            <Button onClick={this.showCode}>ステージに移す</Button>
          </Toolbar>
        </AppBar>
        <ReactMapEditor
          ref={ref => (window.root = ref)}
          tileset={tileset}
          map={defaultMap()}
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

function defaultMap() {
  // 15x10 の草原からスタート
  const row = index => Array.from({ length: 15 }).map(() => index);
  const table = index => Array.from({ length: 10 }).map(() => row(index));

  return {
    tables: [table(-888), table(-888), table(1000)],
    squares: [
      {
        index: 1000,
        placement: {
          type: 'Ground'
        },
        tile: {
          size: [32, 32],
          image: {
            type: 'data-url',
            src:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAA4UlEQVRYw8WXMQ7CQAwE8xEED+GBlFT5RFpKHsGPQJzkZtFqvQFuCxe+8ykT39pxlu1xfr7tejsOW++nYeXjPouvdTyP+3h+iQOwwMt2GMbA0Gfxtc7A8wAshSyl3StQV1JgeQCV4gpkfld8zM8DoOi6KXfFxvw8gNtQGBiWoWpgVITTAdwHqXj3RfIALIWqtaqUs7LF+DzA7LKTGpgOgGJRrZaJyy3Dj1YcA/hXGXbFmAfYO1y6DUf2gRiAO2i4DUiNcHmAX4vLHWbzAN2Ufzu22/8F0wD2iq/7uVVlHAd4AY/m2cw040lfAAAAAElFTkSuQmCC'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        }
      }
    ]
  };
}

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
