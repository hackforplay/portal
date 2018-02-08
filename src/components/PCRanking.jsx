import * as React from 'react';
import { withStyles } from 'material-ui/styles';

import type { RecordCollectionType } from '../ducks/pcRanking';

type Props = {
  classes: {},
  records: RecordCollectionType
};

const stages = ['stages/semi1', 'stages/semi2', 'stages/semi3'];

@withStyles({})
export default class PCRanking extends React.Component<Props> {
  render() {
    const { classes, records } = this.props;

    return (
      <div>
        <h1>ランキング</h1>
        {records.isAvailable
          ? records.data.map(item => <div key={item.id}>{item.name}</div>)
          : 'Loading'}
      </div>
    );
  }
}
