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
import { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';
import { grey } from 'material-ui/colors';
import { css, cx } from 'emotion';

import { type StateProps, type DispatchProps } from '../containers/MapList';
import CardMedia from '../containers/CardMedia';
import theme from '../settings/theme';
import noImage from '../resources/no-image.png';
import { type MapDocument } from '../ducks/maps';

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
  maps: $npm$firebase$firestore$DocumentSnapshot[],
  title: React.Node,
  more: boolean,
  moreLink: string,
  showVisibility: boolean,
  className?: string
};

export type State = {};

export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

@withRouter
export default class WorkList extends React.Component<Props, State> {
  render() {
    const { maps, title, more, showVisibility } = this.props;

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
            {maps.map(item => (
              <Grid item key={item.id}>
                {
                  <MapListItem
                    documentSnapshot={item}
                    showVisibility={showVisibility}
                  />
                }
              </Grid>
            ))}
          </Grid>
        </Collapse>
        <Link to="/map-editor">マップをつくる</Link>
      </Paper>
    );
  }
}

type MapListItemProps = {
  documentSnapshot: $npm$firebase$firestore$DocumentSnapshot,
  showVisibility: boolean
};

class MapListItem extends React.Component<MapListItemProps> {
  fromNow(timestamp: FirestoreTimestamp) {
    return moment(timestamp.toDate()).fromNow();
  }

  render() {
    const item: MapDocument = (this.props.documentSnapshot.data(): any);
    return (
      <Link to={`/maps/${this.props.documentSnapshot.id}`}>
        <Card
          elevation={0}
          className={cx(
            classes.card,
            classes.thumbnail
            // item.visibility === 'private' && classes.card_private
          )}
        >
          <CardMedia
            component="img"
            src={noImage}
            storagePath={item.thumbnailStoragePath}
          />
          <CardContent>
            <Typography type="caption">
              {this.fromNow(item.updatedAt || item.createdAt)}
              {this.props.showVisibility
                ? {
                    public: '・公開中',
                    limited: '・限定公開',
                    private: '・非公開'
                  }[item.visibility]
                : ''}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    );
  }
}
