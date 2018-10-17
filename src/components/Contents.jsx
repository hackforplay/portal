// @flow
import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import type { ContextRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { style } from 'typestyle';
import { important } from 'csx';

import theme from '../settings/theme';
import contents from '../settings/contents';
import type { ContentType } from '../settings/contents';
import * as xlasses from '../utils/xlasses';

const rootStyle = style({
  maxWidth: 840,
  boxSizing: 'border-box',
  marginTop: theme.spacing.unit * 4,
  marginBottom: theme.spacing.unit * 4,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: theme.spacing.unit * 4,
  paddingRight: theme.spacing.unit * 4
});

export type OwnProps = {};

class Contents extends React.Component<OwnProps & { ...ContextRouter }> {
  render() {
    const { location } = this.props;

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
          <YouTubeContent key={item.title} {...this.props} {...item} />
        ) : item.type === 'stage' ? (
          <StageContent key={item.title} {...this.props} {...item} />
        ) : null,
        <Divider key={item.title + '-divider'} />
      );
    }
    children.pop(); // Remove <Devidier /> at last

    return (
      <div>
        <Paper className={rootStyle}>{children}</Paper>
      </div>
    );
  }
}

const stageStyle = {
  item: style({
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  }),
  alignMiddle: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: important(32)
  }),
  img: style({
    width: '100%',
    paddingRight: theme.spacing.unit * 2
  })
};

function StageContent(props: ContentType & { ...ContextRouter }) {
  return (
    <Grid
      container
      spacing={16}
      className={stageStyle.item}
      onClick={() => {
        if (props.url) {
          props.history.push(props.url);
        }
      }}
    >
      <Grid item xs={6}>
        <img src={props.image} alt="" className={stageStyle.img} />
      </Grid>
      <Grid item xs={6} className={stageStyle.alignMiddle}>
        <div />
        <div>
          <Typography variant="title" align="left" gutterBottom>
            {props.title}
          </Typography>
          <Typography variant="caption" align="left">
            {props.description}
          </Typography>
        </div>
        <div>
          {props.buttons.map((item, i) => (
            <Button
              {...item}
              key={i}
              className={xlasses.largeButton}
              onClick={event => event.stopPropagation()}
            >
              {item.children}
            </Button>
          ))}
        </div>
      </Grid>
    </Grid>
  );
}

const youtubeStyle = {
  item: style({
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  }),
  alignMiddle: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }),
  button: style({
    marginRight: theme.spacing.unit * 2
  }),
  responsive: style({
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
  })
};

function YouTubeContent(props: ContentType) {
  return (
    <Grid container spacing={16} className={youtubeStyle.item}>
      <Grid item xs={6}>
        <div className={youtubeStyle.responsive}>
          <iframe
            title={props.title}
            src={props.url}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </Grid>
      <Grid item xs={6} className={youtubeStyle.alignMiddle}>
        <div />
        <div>
          <Typography variant="title" align="left">
            {props.title}
          </Typography>
          <Typography variant="caption" align="left">
            {props.description}
          </Typography>
        </div>
        <div>
          {props.buttons.map((item, i) => (
            <Button {...item} key={i} className={youtubeStyle.button}>
              {item.children}
            </Button>
          ))}
        </div>
      </Grid>
    </Grid>
  );
}

export default Contents;
