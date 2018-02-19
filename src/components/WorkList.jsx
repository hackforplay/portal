// @flow
import * as React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card/Card';
import { CardHeader, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Collapse from 'material-ui/transitions/Collapse';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import theme from '../settings/theme';
import noImage from '../resources/no-image.png';
import type { WorkCollectionType } from '../ducks/work';

export type Props = {
  classes: {
    root: string,
    card: string,
    media: string,
    headline: string,
    title: string,
    subheader: string,
    authorName: string,
    button: string,
    more: string
  },
  works: WorkCollectionType,
  title: React.Node,
  more: boolean,
  moreLink: string,
  className?: string
} & ContextRouter;

@withRouter
@withStyles({
  root: {
    padding: theme.spacing.unit * 6
  },
  card: {
    minWidth: 240,
    maxWidth: 240,
    cursor: 'pointer',
    textAlign: 'left'
  },
  media: {
    height: 160
  },
  headline: {
    marginBottom: theme.spacing.unit * 4
  },
  title: {
    maxHeight: 48,
    overflow: 'hidden'
  },
  subheader: {
    maxWidth: 176,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  authorName: {
    color: grey[500],
    '&:hover': {
      color: grey[900]
    }
  },
  more: {
    width: '100%',
    position: 'relative',
    textAlign: 'center',
    '&:before': {
      display: 'block',
      whiteSpace: 'pre',
      content: '""',
      position: 'relative',
      marginTop: -16,
      width: '100%',
      height: 16,
      background: 'linear-gradient(to bottom, transparent, white)'
    }
  },
  button: {
    fontSize: 'large',
    marginTop: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4
  }
})
export default class WorkList extends React.Component<Props> {
  static defaultProps = {
    more: false
  };

  link(to: string) {
    const { history } = this.props;
    return (event: SyntheticMouseEvent<HTMLButtonElement>) => {
      // 外側の Link を無視する
      event.stopPropagation();
      // to へ移動する
      history.push(to);
    };
  }

  fromNow(created_at: string) {
    return moment(created_at, 'YYYY-MM-DD hh:mm:ss')
      .add(moment().utcOffset(), 'm')
      .fromNow();
  }

  render() {
    const { classes, works, title, more, moreLink } = this.props;

    return (
      <Paper className={classNames(classes.root, this.props.className)}>
        {typeof title === 'string' ? (
          <Typography type="headline" className={classes.headline}>
            {title}
          </Typography>
        ) : (
          title
        )}
        <Collapse collapsedHeight="284px" in={more}>
          <Grid container justify="center">
            {works.isProcessing ? <CircularProgress /> : null}
            {works.isAvailable &&
              works.data.map(item => (
                <Grid item key={item.id}>
                  <Card
                    elevation={0}
                    className={classes.card}
                    onClick={this.link(`/products/${item.search}`)}
                  >
                    <CardMedia
                      className={classes.media}
                      image={item.image || noImage}
                      title={item.title}
                    />
                    <CardHeader
                      action={
                        <IconButton onClick={e => e.stopPropagation()}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={<Typography type="body2">{item.title}</Typography>}
                      subheader={
                        <span
                          onClick={this.link(`/anonymous/${item.author}`)}
                          className={classes.authorName}
                        >
                          {item.author}
                        </span>
                      }
                      classes={{
                        title: classes.title,
                        subheader: classes.subheader
                      }}
                    />
                    <CardContent>
                      <Typography type="caption">
                        {`プレイ回数 ${item.views} 回・${this.fromNow(
                          item.created_at
                        )}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Collapse>
        {more ? null : (
          <div className={classes.more}>
            <Button
              raised
              color="primary"
              className={classes.button}
              component={Link}
              to={moreLink}
            >
              もっと見る
            </Button>
          </div>
        )}
      </Paper>
    );
  }
}
