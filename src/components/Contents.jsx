import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import type { ContextRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import contents from '../settings/contents';
import type { ContentType } from '../settings/contents';

type Props = {
  classes: {
    root: string
  }
} & ContextRouter;

@withStyles({
  root: {
    maxWidth: 840,
    boxSizing: 'border-box',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4
  }
})
class Contents extends React.Component<Props> {
  render() {
    const { classes, location } = this.props;

    // 現在表示している URL にふさわしいデータソースを取得する
    const source = contents.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!source) {
      return null;
    }

    const children = [];

    for (const item of source.items) {
      children.push(
        item.type === 'youtube' ? (
          <YouTubeContent key={item.title} {...item} />
        ) : item.type === 'stage' ? (
          <StageContent key={item.title} {...item} />
        ) : null,
        <Divider key={item.title + '-divider'} />
      );
    }
    children.pop(); // Remove <Devidier /> at last

    return (
      <div>
        <Paper className={classes.root}>{children}</Paper>
      </div>
    );
  }
}

type StageContentProps = {
  classes: {
    item: string,
    alignMiddle: string,
    img: string,
    button: string
  },
  image: string,
  title: string,
  description: string,
  buttons: Array<{}>
} & ContentType;

@withStyles({
  item: {
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  },
  alignMiddle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  img: {
    width: '100%',
    paddingRight: theme.spacing.unit * 2
  },
  button: {
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
})
export class StageContent extends React.Component<StageContentProps> {
  stopPropagation(event: SyntheticEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  render() {
    const { classes } = this.props;

    const linkProps = this.props.url
      ? {
          component: Link,
          to: this.props.url
        }
      : {};

    return (
      <Grid
        key={this.props.title}
        container
        spacing={16}
        className={classes.item}
        {...linkProps}
      >
        <Grid item xs={6}>
          <img src={this.props.image} alt="" className={classes.img} />
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.alignMiddle}
          style={{ padding: 32 }}
        >
          <div />
          <div>
            <Typography type="title" align="left" gutterBottom>
              {this.props.title}
            </Typography>
            <Typography type="caption" align="left">
              {this.props.description}
            </Typography>
          </div>
          <div>
            {this.props.buttons.map((item, i) => (
              <Button
                {...item}
                key={i}
                className={classes.button}
                onClick={this.stopPropagation}
              />
            ))}
          </div>
        </Grid>
      </Grid>
    );
  }
}

type YouTubeContentProps = {
  classes: {
    item: string,
    alignMiddle: string,
    button: string,
    responsive: string
  }
} & ContentType;

@withStyles({
  item: {
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  },
  alignMiddle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  button: {
    marginRight: theme.spacing.unit * 2
  },
  responsive: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    maxWidth: '100%',
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
  }
})
class YouTubeContent extends React.Component<YouTubeContentProps> {
  stopPropagation(event: SyntheticMouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid
        key={this.props.title}
        container
        spacing={16}
        className={classes.item}
      >
        <Grid item xs={6}>
          <div className={classes.responsive}>
            <iframe
              title={this.props.title}
              src={this.props.url}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </Grid>
        <Grid item xs={6} className={classes.alignMiddle}>
          <div />
          <div>
            <Typography type="title" align="left">
              {this.props.title}
            </Typography>
            <Typography type="caption" align="left">
              {this.props.description}
            </Typography>
          </div>
          <div>
            {this.props.buttons.map((item, i) => (
              <Button {...item} key={i} className={classes.button} />
            ))}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default Contents;
