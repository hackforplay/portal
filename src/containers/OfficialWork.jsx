import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'react-redux';

import officials from '../settings/officials';
import Work from '../components/Work';
import { changeWork, trashWork, saveWork } from '../ducks/make';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState) => {
  return {
    isSignedIn: !!state.auth.user,
    make: state.make
  };
};

const mapDispatchToProps = {
  changeWork,
  trashWork,
  saveWork
};

@connect(mapStateToProps, mapDispatchToProps)
export default class OfficialWork extends React.Component {
  componentWillUnmount() {
    this.props.trashWork();
  }

  render() {
    const { location, isSignedIn } = this.props;

    // 現在表示している URL にふさわしいデータソースを取得する
    const source = officials.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!source) {
      return null;
    }

    return (
      <Work
        {...this.props}
        replayable={isSignedIn && source.replayable}
        work={source.work}
      />
    );
  }
}
