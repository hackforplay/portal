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
import { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Menu from 'material-ui/Menu/Menu';
import { MenuItem } from 'material-ui/Menu';
import Collapse from 'material-ui/transitions/Collapse';
import { grey } from 'material-ui/colors';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { css, cx } from 'emotion';

import { type StateProps, type DispatchProps } from '../containers/WorkList';
import CardMedia from '../containers/CardMedia';
import theme from '../settings/theme';
import noImage from '../resources/no-image.png';
import { type WorkCollectionType, type WorkData } from '../ducks/work';
import { removeMessage } from './Work';

export const classes = {
  root: css({
    padding: theme.spacing.unit * 6
  }),
  card: css({
    cursor: 'pointer',
    textAlign: 'left'
  }),
  thumbnail: css({
    width: 240,
    '&>img': {
      minHeight: 160,
      maxHeight: 160,
      objectFit: 'cover',
      // https://github.com/bfred-it/object-fit-images/
      fontFamily: "'object-fit: contain;'"
    }
  }),
  card_private: css({
    filter: `brightness(90%)`
  }),
  headline: css({
    marginBottom: theme.spacing.unit * 4
  }),
  title: css({
    maxHeight: 48,
    overflow: 'hidden'
  }),
  noTitle: css({
    fontStyle: 'italic'
  }),
  subheader: css({
    maxWidth: 176,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  authorName: css({
    color: grey[500],
    '&:hover': {
      color: grey[900]
    }
  }),
  noAuthorName: css({
    color: grey[500],
    fontStyle: 'italic'
  }),
  more: css({
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
  }),
  button: css({
    fontSize: 'large',
    marginTop: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4
  })
};

export type OwnProps = {
  works: WorkCollectionType,
  title: React.Node,
  more: boolean,
  moreLink: string,
  showVisibility: boolean,
  className?: string
};

export type State = {
  anchor: HTMLElement | null,
  item: WorkData | null
};

export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

@withRouter
export default class WorkList extends React.Component<Props, State> {
  state = {
    anchor: null,
    item: null
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

  fromNow(createdAt: string | Date) {
    if (typeof createdAt === 'object') {
      createdAt = createdAt.toISOString();
    }
    return moment(createdAt, 'YYYY-MM-DD hh:mm:ss')
      .add(moment().utcOffset(), 'm')
      .fromNow();
  }

  handleOpen = (item: WorkData) => (event: SyntheticEvent<HTMLElement>) => {
    event.stopPropagation(); // 遷移しないように
    this.setState({
      anchor: event.currentTarget,
      item
    });
  };

  handleClose = () => {
    this.setState({
      anchor: null,
      item: null
    });
  };

  handleRemove = () => {
    if (window.confirm(removeMessage)) {
      this.props.removeWork(this.state.item);
    }
    this.handleClose();
  };

  render() {
    const {
      works,
      title,
      more,
      moreLink,
      showVisibility,
      authUser
    } = this.props;
    const { anchor } = this.state;

    return (
      <Paper className={classNames(classes.root, this.props.className)}>
        {typeof title === 'string' ? (
          <Typography type="headline" className={classes.headline}>
            {title}
          </Typography>
        ) : (
          title
        )}
        <Collapse collapsedHeight="284px" in={more || false}>
          <Grid container justify="center">
            {works.data ? (
              works.data.map(item => (
                <Grid item key={item.path}>
                  <Card
                    elevation={0}
                    className={cx(
                      classes.card,
                      classes.thumbnail,
                      item.visibility === 'private' && classes.card_private
                    )}
                    onClick={this.link(item.path)}
                  >
                    <CardMedia
                      component="img"
                      src={item.image || noImage}
                      title={item.title}
                      storagePath={item.thumbnailStoragePath}
                    />
                    <CardHeader
                      action={
                        authUser && authUser.uid === item.uid ? (
                          <IconButton onClick={this.handleOpen(item)}>
                            <MoreVertIcon />
                          </IconButton>
                        ) : null
                      }
                      title={
                        <Typography
                          type="body2"
                          className={classNames({
                            [classes.noTitle]: !item.title
                          })}
                        >
                          {item.title || `タイトルがついていません`}
                        </Typography>
                      }
                      subheader={
                        <span
                          onClick={this.link(
                            item.uid
                              ? `/users/${item.uid}`
                              : `/anonymous/${item.author || ''}`
                          )}
                          className={classNames({
                            [classes.authorName]: !!item.author,
                            [classes.noAuthorName]: !item.author
                          })}
                        >
                          {item.author || '名無しの権兵衛'}
                        </span>
                      }
                      classes={{
                        title: classes.title,
                        subheader: classes.subheader
                      }}
                    />
                    <CardContent>
                      <Typography type="caption">
                        {item.viewsNum
                          ? `プレイ回数 ${item.viewsNum} 回`
                          : 'NEW!'}
                        {item.createdAt
                          ? `・${this.fromNow(item.createdAt)}`
                          : ''}
                        {showVisibility
                          ? {
                              public: '・公開中',
                              limited: '・限定公開',
                              private: '・非公開'
                            }[item.visibility]
                          : ''}
                        {item.clearRate
                          ? `・${Math.floor(item.clearRate * 100)}%の人がクリア`
                          : ''}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item>
                {works.isProcessing ? <CircularProgress /> : null}
                {works.isInvalid ? (
                  <Typography type="headline">
                    {`エラーが発生しました`}
                    <span role="img" aria-label="Confused">
                      {`😕`}
                    </span>
                    {works.error}
                  </Typography>
                ) : null}
                {works.isEmpty ? (
                  <Typography type="headline">
                    {`ステージが見つかりませんでした`}
                    <span role="img" aria-label="Confused">
                      {`😕`}
                    </span>
                  </Typography>
                ) : null}
              </Grid>
            )}
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
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleRemove}>削除する</MenuItem>
        </Menu>
      </Paper>
    );
  }
}
