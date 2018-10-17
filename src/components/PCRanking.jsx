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
import type { ContextRouter } from 'react-router-dom';
import { style } from 'typestyle';

import theme from '../settings/theme';
import type { StateProps, DispatchProps } from '../containers/PCRanking';

const cn = {
  root: style({
    maxWidth: 840,
    marginLeft: 'auto',
    marginRight: 'auto'
  }),
  progress: style({
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing.unit * 6
  }),
  button: style({
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  }),
  cell: style({
    maxWidth: 200,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  })
};

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

const fromNow = (createdAt: string) => {
  return moment(createdAt, 'ddd MMM DD YYYY hh:mm:ss GMTZ').fromNow();
};

export type Props = StateProps & DispatchProps & { ...ContextRouter };

export default ({ records, match }: Props) => {
  const stage = match.params && match.params.stage;
  if (!stage) {
    return null;
  }

  return (
    <div className={cn.root}>
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
                  <TableCell
                    numeric={false}
                    padding="default"
                    className={cn.cell}
                  >{`${i + 1}位`}</TableCell>
                  <TableCell
                    numeric={false}
                    padding="default"
                    className={cn.cell}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell
                    numeric={false}
                    padding="default"
                    className={cn.cell}
                  >
                    {item.score}
                  </TableCell>
                  <TableCell
                    numeric={false}
                    padding="default"
                    className={cn.cell}
                  >{`${item.lastTime}秒`}</TableCell>
                  <TableCell
                    numeric={false}
                    padding="default"
                    className={cn.cell}
                  >
                    {fromNow(item.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : records.isEmpty ? (
        <Typography variant="display1">
          まだ記録がないか、無効なステージです :-(
        </Typography>
      ) : (
        <CircularProgress className={cn.progress} />
      )}
      <Button
        variant="raised"
        color="primary"
        component={Link}
        to={playLinks[stage]}
        className={cn.button}
      >
        このステージをプレイする
      </Button>
    </div>
  );
};
