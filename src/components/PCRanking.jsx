// @flow
import * as React from 'react';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import type { RecordCollectionType } from '../ducks/pcRanking';

type Props = {
  classes: {
    root: string,
    progress: string
  },
  records: RecordCollectionType
};

@withStyles({
  root: {
    maxWidth: 840,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  progress: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing.unit * 6
  }
})
export default class PCRanking extends React.Component<Props> {
  render() {
    const { classes, records } = this.props;

    return (
      <div className={classes.root}>
        <h1>ランキング</h1>
        {records.isAvailable ? (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>順位</TableCell>
                  <TableCell>名前</TableCell>
                  <TableCell>スコア</TableCell>
                  <TableCell>残り時間</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.data.map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell>{`${i + 1}位`}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.score}</TableCell>
                    <TableCell>{`${item.lastTime}秒`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : records.isEmpty ? (
          <Typography type="display1">
            まだ記録がないか、無効なステージです :-(
          </Typography>
        ) : (
          <CircularProgress className={classes.progress} />
        )}
      </div>
    );
  }
}
