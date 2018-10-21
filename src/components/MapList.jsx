// @flow
import * as React from 'react';
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
import { style, classes } from 'typestyle';

import { type StateProps, type DispatchProps } from '../containers/MapList';
import CardMedia from '../containers/CardMedia';
import noImage from '../resources/no-image.png';
import { type MapDocument } from '../ducks/maps';

export const cn = {
  card: style({
    cursor: 'pointer',
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
    $nest: {
      '&:hover': {
        color: grey[900]
      }
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
  })
});

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
    const dcn = getCn(this.props);
    const { maps, title, more, showVisibility } = this.props;

    return (
      <Paper className={classes(dcn.root, this.props.className)}>
        {typeof title === 'string' ? (
          <Typography type="headline" className={dcn.headline}>
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
          className={classes(
            cn.card,
            cn.thumbnail
            // item.visibility === 'private' && cn.card_private
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
