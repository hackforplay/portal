// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import { css } from 'emotion';

import type ReactMapEditorType from 'react-map-editor';

const classes = {
  root: css({
    height: 'calc(100vh - 56px)',
    '@media (min-width:0px) and (orientation: landscape)': {
      height: 'calc(100vh - 48px)'
    },
    '@media (min-width:600px)': {
      height: 'calc(100vh - 64px)'
    }
  })
};

export type OwnProps = {};

type State = {
  ReactMapEditor: ReactMapEditorType | null,
  tileset: any[]
};

type Props = OwnProps & { ...ContextRouter };

@withRouter
class MapEditor extends React.Component<Props, State> {
  state = {
    ReactMapEditor: null,
    tileset: []
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

  render() {
    const { ReactMapEditor, tileset } = this.state;

    if (!ReactMapEditor) {
      return <div>Loading...</div>;
    }

    return (
      <div className={classes.root}>
        <ReactMapEditor
          ref={ref => (window.root = ref)}
          tileset={tileset}
          map={defaultMap()}
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
