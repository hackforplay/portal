// @flow
import * as React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Collapse from '@material-ui/core/Collapse';
import { grey } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { style, classes } from 'typestyle';

import { type StateProps, type DispatchProps } from '../containers/WorkList';
import CardMedia from '../containers/CardMedia';
import { withTheme } from '@material-ui/core/styles';
import noImage from '../resources/no-image.png';
import { type WorkCollectionType, type WorkData } from '../ducks/work';
import { removeMessage } from './Work';

export const cn = {
  card: style({
    textAlign: 'left'
  }),
  thumbnail: style({
    width: 240,
    $nest: {
      '&>img': {
        minHeight: 160,
        maxHeight: 160,
        objectFit: 'cover',
        // https://github.com/bfred-it/object-fit-images/
        fontFamily: "'object-fit: contain;'"
      }
    }
  }),
  card_private: style({
    filter: `brightness(90%)`
  }),
  title: style({
    maxHeight: 48,
    overflow: 'hidden'
  }),
  noTitle: style({
    fontStyle: 'italic'
  }),
  subheader: style({
    maxWidth: 176,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  authorName: style({
    color: grey[500],
    '&:hover': {
      color: grey[900]
    }
  }),
  noAuthorName: style({
    color: grey[500],
    fontStyle: 'italic'
  }),
  more: style({
    width: '100%',
    position: 'relative',
    textAlign: 'center',
    $nest: {
      '&::before': {
        display: 'block',
        whiteSpace: 'pre',
        content: '""',
        position: 'relative',
        marginTop: -16,
        width: '100%',
        height: 16,
        background: 'linear-gradient(to bottom, transparent, white)'
      }
    }
  })
};
const getCn = props => ({
  root: style({
    padding: props.theme.spacing.unit * 6
  }),
  headline: style({
    marginBottom: props.theme.spacing.unit * 4
  }),
  button: style({
    fontSize: 'large',
    marginTop: props.theme.spacing.unit * 2,
    paddingTop: props.theme.spacing.unit * 2,
    paddingRight: props.theme.spacing.unit * 4,
    paddingBottom: props.theme.spacing.unit * 2,
    paddingLeft: props.theme.spacing.unit * 4
  })
});

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

@withTheme()
@withRouter
export default class WorkList extends React.Component<Props, State> {
  state = {
    anchor: null,
    item: null
  };

  fromNow(createdAt: string | Date) {
    if (typeof createdAt === 'object') {
      if (typeof createdAt.toDate === 'function') {
        createdAt = createdAt.toDate().toISOString();
      } else if (typeof createdAt.toISOString === 'function') {
        createdAt = createdAt.toISOString();
      } else {
        return '';
      }
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
    const dcn = getCn(this.props);
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
      <Paper className={classes(dcn.root, this.props.className)}>
        {typeof title === 'string' ? (
          <Typography variant="h5" className={dcn.headline}>
            {title}
          </Typography>
        ) : (
          title
        )}
        <Collapse collapsedHeight="284px" in={more || false}>
          <Grid container justify="center" spacing={8}>
            {works.data ? (
              works.data.map(item => (
                <Grid item key={item.id}>
                  <Card
                    elevation={0}
                    className={classes(
                      cn.card,
                      cn.thumbnail,
                      item.visibility === 'private' && cn.card_private
                    )}
                  >
                    <Link to={item.path + ''}>
                      <CardMedia
                        component="img"
                        src={item.image || noImage}
                        title={item.title}
                        storagePath={item.thumbnailStoragePath}
                      />
                    </Link>
                    <CardHeader
                      action={
                        authUser && authUser.uid === item.uid ? (
                          <IconButton onClick={this.handleOpen(item)}>
                            <MoreVertIcon />
                          </IconButton>
                        ) : null
                      }
                      title={
                        <Link to={item.path + ''}>
                          <Typography
                            variant="body2"
                            className={classes(!item.title && cn.noTitle)}
                          >
                            {item.title + ''}
                          </Typography>
                        </Link>
                      }
                      subheader={
                        <Link
                          to={
                            item.uid
                              ? `/users/${item.uid}`
                              : `/anonymous/${item.author || ''}`
                          }
                        >
                          <span
                            className={
                              item.author ? cn.authorName : cn.noAuthorName
                            }
                          >
                            {item.author + ''}
                          </span>
                        </Link>
                      }
                      classes={{
                        title: cn.title,
                        subheader: cn.subheader
                      }}
                    />
                    <CardContent>
                      <Typography variant="caption">
                        {item.viewsNum > 0
                          ? this.fromNow(item.createdAt)
                          : 'NEW!'}
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
                  <Typography variant="h5">
                    {`エラーが発生しました`}
                    <span role="img" aria-label="Confused">
                      {`😕`}
                    </span>
                    {works.error}
                  </Typography>
                ) : null}
                {works.isEmpty ? (
                  <Typography variant="h5">
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
          <div className={cn.more}>
            <Button
              variant="contained"
              color="primary"
              className={dcn.button}
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
