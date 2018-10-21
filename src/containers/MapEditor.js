// @flow
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, type ContextRouter } from 'react-router-dom';

import MapEditor from '../components/MapEditor';
import type { OwnProps } from '../components/MapEditor';
import type { StoreState } from '../ducks';
import {
  saveNewMapJson,
  type MapDocumentState,
  type MapDataState,
  loadMap,
  updateMapJson
} from '../ducks/maps';
import * as helpers from '../ducks/helpers';

export type StateProps = {
  isUploading: boolean,
  mapDocument: MapDocumentState,
  mapState: MapDataState
};

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

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => {
  const id = ownProps.match.params.id;

  const mapDocument = id
    ? state.maps.byPath[`maps/${id}`] || helpers.processing()
    : helpers.empty();

  const mapState = id
    ? state.maps.dataByPath[`maps/${id}`] || helpers.processing()
    : helpers.has(defaultMap());

  return {
    isUploading: state.maps.isUploading,
    mapDocument,
    mapState
  };
};

const mapDispatchToProps = {
  saveNewMapJson,
  loadMap,
  updateMapJson
};

export type DispatchProps = { ...typeof mapDispatchToProps };

type Props = StateProps & DispatchProps & { ...ContextRouter };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(
  class extends React.Component<Props> {
    componentDidMount() {
      const id = this.props.match.params.id;
      if (id) {
        // ロードされていなければロードする
        this.props.loadMap(`maps/${id}`);
      }
    }

    render() {
      return <MapEditor {...this.props} />;
    }
  }
);
