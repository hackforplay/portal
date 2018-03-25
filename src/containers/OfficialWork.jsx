import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'react-redux';

import officials from '../settings/officials';
import Work from '../components/Work';
import * as helpers from '../ducks/helpers';
import {
  changeWork,
  trashWork,
  saveWork,
  setWorkVisibility,
  setMetadata,
  canSave
} from '../ducks/make';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => {
  const { location } = ownProps;

  // 現在表示している URL にふさわしいデータソースを取得する
  const source = officials.find(item => {
    const re = pathToRegexp(item.path);
    return re.exec(location.pathname);
  });
  const work = source ? source.work : helpers.invalid('Not Found');
  const replayable = source ? source.replayable : false;

  return {
    work,
    make: state.make,
    replay: replayable && !!state.auth.user,
    canSave: canSave(state),
    // URL が間違っているとき null を render する
    // replay かどうかを確かめるために onAuthStateChanged を待つ
    renderNull: !state.auth.initialized
  };
};

const mapDispatchToProps = {
  changeWork,
  trashWork,
  saveWork,
  setWorkVisibility,
  setMetadata
};

@connect(mapStateToProps, mapDispatchToProps)
export default class OfficialWork extends React.Component {
  componentWillUnmount() {
    this.props.trashWork();
  }

  render() {
    const { renderNull, ...props } = this.props;

    if (renderNull) {
      return null;
    }

    return <Work {...props} />;
  }
}
