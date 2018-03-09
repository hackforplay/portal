import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'react-redux';

import officials from '../settings/officials';
import Work from '../components/Work';
import { changeWork } from '../ducks/work';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  changeWork
};

@connect(mapStateToProps, mapDispatchToProps)
export default class OfficialWork extends React.Component {
  render() {
    const { location } = this.props;

    // 現在表示している URL にふさわしいデータソースを取得する
    const source = officials.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!source) {
      return null;
    }

    return <Work {...this.props} work={source.work} />;
  }
}
