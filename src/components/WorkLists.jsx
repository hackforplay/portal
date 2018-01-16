import * as React from 'react';
import classNames from 'classnames';
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

import type { Work } from '../ducks/work';
import theme from '../settings/theme';

export type Props = {
  classes: {
    root: string
  },
  lists: {
    recommended: Array<Work>,
    trending: Array<Work>
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
  classes: {
    root: string,
    card: string,
    media: string,
    headline: string,
    title: string,
    subheader: string,
    authorName: string
  },
  works: Array<Work>,
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
  render() {
    const { classes, history, works, title, more, moreLink } = this.props;

    const maxHeight = more ? null : 284;

    return (
      <Paper className={classNames(classes.root, this.props.className)}>
        <Typography type="headline" className={classes.headline}>
          {title}
        </Typography>
        <Collapse collapsedHeight="284px" in={more}>
          <Grid
            container
            justify="center"
            style={{ maxHeight, overflow: 'hidden' }}
          >
            {works.map(item => (
              <Grid item={true} key={item.id}>
                <Card
                  elevation={0}
                  className={classes.card}
                  onClick={() => history.push(`/works/${item.id}`)}
                >
                  <CardMedia
                    className={classes.media}
                    image={item.thumbnail}
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
                      <Link to="" className={classes.authorName}>
                        {item.author.name}
                      </Link>
                    }
                    classes={{
                      title: classes.title,
                      subheader: classes.subheader
                    }}
                  />
                  <CardContent>
                    <Typography type="caption">
                      {`プレイ回数 ${item.playcount} 回・${item.date}`}
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
