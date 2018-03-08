// @flow
import * as React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Table from 'material-ui/Table/Table';
import { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import type { ContextRouter } from 'react-router-dom';

import theme from '../settings/theme';
import type { RecordCollectionType } from '../ducks/pcRanking';

type Props = {
  classes: {
    root: string,
    progress: string,
    button: string
  },
  records: RecordCollectionType
} & ContextRouter;

const playLinks = {
  semi1: '/officials/pg-colosseum/#/stages/semi1/index.html',
  semi2: '/officials/pg-colosseum/#/stages/semi2/index.html',
  semi3: '/officials/pg-colosseum/#/stages/semi3/index.html',

  final1: '/officials/pg-colosseum/#/stages/final1/index.html',
  final2: '/officials/pg-colosseum/#/stages/final2/index.html',
  final3: '/officials/pg-colosseum/#/stages/final3/index.html',

  grand1: '/officials/pg-colosseum/#/stages/mogura2/index.html',
  grand2: '/officials/pg-colosseum/#/stages/slot2/index.html',
  grand3: '/officials/pg-colosseum/#/stages/danmaku3/index.html'
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
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  }
})
export default class PCRanking extends React.Component<Props> {
  render() {
    const { classes, records, match } = this.props;
    const stage = match.params && match.params.stage;
    if (!stage) {
      return null;
    }

    const fromNow = (createdAt: string) => {
      return moment(createdAt, 'ddd MMM DD YYYY hh:mm:ss GMTZ').fromNow();
    };

    return (
      <div className={classes.root}>
        <h1>ランキング</h1>
        {records.data ? (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell numeric={false} padding="default">
                    順位
                  </TableCell>
                  <TableCell numeric={false} padding="default">
                    名前
                  </TableCell>
                  <TableCell numeric={false} padding="default">
                    スコア
                  </TableCell>
                  <TableCell numeric={false} padding="default">
                    残り時間
                  </TableCell>
                  <TableCell numeric={false} padding="default" />
                </TableRow>
              </TableHead>
              <TableBody>
                {records.data.map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell numeric={false} padding="default">{`${i +
                      1}位`}</TableCell>
                    <TableCell numeric={false} padding="default">
                      {item.name}
                    </TableCell>
                    <TableCell numeric={false} padding="default">
                      {item.score}
                    </TableCell>
                    <TableCell numeric={false} padding="default">{`${
                      item.lastTime
                    }秒`}</TableCell>
                    <TableCell numeric={false} padding="default">
                      {fromNow(item.createdAt)}
                    </TableCell>
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
        <Button
          raised
          color="primary"
          component={Link}
          to={playLinks[stage]}
          className={classes.button}
        >
          このステージをプレイする
        </Button>
      </div>
    );
  }
}
