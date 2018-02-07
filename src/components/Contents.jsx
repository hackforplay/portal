import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import * as contents from '../settings/contents';
import type { ContentType } from '../settings/contents';

type Props = {
  classes: {
    root: string
  }
} & ContextRouter;

@withStyles({
  root: {
    maxWidth: 800,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing.unit * 4
  }
})
class Contents extends React.Component<Props> {
  render() {
    const { classes, match } = this.props;

    // データソースを取得する
    const source = contents[match.params.tab];
    if (!source) {
      console.error(`${match.params.tab} is no found`);
      return null;
    }

    const children = [];

    for (const item of source) {
      children.push(
        match.params.tab === 'youtube' ? (
          <YouTubeContent key={item.url} {...item} />
        ) : (
          <StageContent key={item.url} {...item} />
        ),
        <Divider key={item.url + '-divider'} />
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
    paddingBottom: theme.spacing.unit * 4,
    cursor: 'pointer'
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
    marginRight: theme.spacing.unit * 2
  }
})
export class StageContent extends React.Component<StageContentProps> {
  stopPropagation(event: SyntheticEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid
        key={this.props.url}
        container
        spacing={16}
        className={classes.item}
        onClick={() => (window.location.href = this.props.url)}
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
        key={this.props.url}
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
