// @flow
import * as React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Card, { CardHeader, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import theme from '../settings/theme';
import noImage from '../resources/no-image.png';

type WorkType = {
  id: number,
  title: string,
  description?: string,
  image?: string,
  asset_url: ?string,
  search: string,
  url: string,
  author?: string,
  created_at: string,
  views: number,
  favs: number
};

export type Props = {
  classes: {
    root: string
  },
  lists: {
    recommended: Array<WorkType>,
    trending: Array<WorkType>
  }
} & ContextRouter;

@withStyles({
  root: {
    padding: theme.spacing.unit * 4
  }
})
class WorkLists extends React.Component<Props> {
  render() {
    const { classes, match, lists } = this.props;

    // 現在の URL に対して適切なデータを表示
    const more = match.params.more;
    return (
      <div className={classes.root}>
        <WorkList
          works={lists.recommended}
          title="おすすめの作品"
          more={more === 'recommended'}
          moreLink="/lists/recommended"
        />
        <WorkList
          works={lists.trending}
          title="人気の作品"
          more={more === 'trending'}
          moreLink="/lists/trending"
        />
      </div>
    );
  }
}

export type ListProps = {
  classes?: {
    root: string,
    card: string,
    media: string,
    headline: string,
    title: string,
    subheader: string,
    authorName: string
  },
  works: Array<WorkType>,
  title: string,
  more: boolean,
  moreLink: string,
  className?: string
} & ContextRouter;

@withRouter
@withStyles({
  root: {
    padding: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 5
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
  }
})
export class WorkList extends React.Component<ListProps> {
  static defaultProps = {
    more: false
  };

  pushInnerLink(to: string) {
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
        <Typography type="headline" className={classes.headline}>
          {title}
        </Typography>
        <Collapse collapsedHeight="284px" in={more}>
          <Grid container justify="center">
            {works.map(item => (
              <Grid item key={item.id}>
                <Card
                  elevation={0}
                  className={classes.card}
                  onClick={() => window.open(item.url, item.url)}
                  // onClick={  this.pushInnerLink(`/works/${item.search}`)}
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
                        className={classes.authorName}
                        // onClick={this.pushInnerLink(`/users/${item.author.id}`)}
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
          <Button raised color="primary" component={Link} to={moreLink}>
            もっと見る
          </Button>
        )}
      </Paper>
    );
  }
}

export default WorkLists;
