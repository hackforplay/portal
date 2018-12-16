// @flow
import * as React from 'react';
import pathToRegexp from 'path-to-regexp';
import type { ContextRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { style } from 'typestyle';
import { important } from 'csx';
import { withTheme } from '@material-ui/core/styles';

import contents from '../settings/contents';
import type { ContentType } from '../settings/contents';
import isEarlybird from '../utils/isEarlybird';

const cn = {
  alignMiddle: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: important(32)
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
const getCn = props => ({
  root: style({
    maxWidth: 840,
    boxSizing: 'border-box',
    marginTop: props.theme.spacing.unit * 4,
    marginBottom: props.theme.spacing.unit * 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: props.theme.spacing.unit * 4,
    paddingRight: props.theme.spacing.unit * 4
  }),
  item: style({
    paddingTop: props.theme.spacing.unit * 4,
    paddingBottom: props.theme.spacing.unit * 4,
    $nest: {
      '& img': {
        width: '100%',
        paddingRight: props.theme.spacing.unit * 2
      },
      '& button': {
        marginRight: props.theme.spacing.unit * 2
      }
    }
  })
});

export type OwnProps = {};

@withTheme()
class Contents extends React.Component<OwnProps & { ...ContextRouter }> {
  render() {
    const dcn = getCn(this.props);
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
      if (!isEarlybird && !item.production) continue; // production には表示しない
      children.push(
        item.type === 'youtube' ? (
          <YouTubeContent
            key={item.title}
            {...this.props}
            {...item}
            className={dcn.item}
          />
        ) : item.type === 'stage' ? (
          <StageContent
            key={item.title}
            {...this.props}
            {...item}
            className={dcn.item}
          />
        ) : null,
        <Divider key={item.title + '-divider'} />
      );
    }
    children.pop(); // Remove <Devidier /> at last

    return (
      <div>
        <Paper className={dcn.root}>{children}</Paper>
      </div>
    );
  }
}

function StageContent(props: ContentType & { ...ContextRouter }) {
  return (
    <Grid
      container
      spacing={16}
      className={props.className}
      onClick={() => {
        if (props.url) {
          props.history.push(props.url);
        }
      }}
    >
      <Grid item xs={6}>
        <img src={props.image} alt="" />
      </Grid>
      <Grid item xs={6} className={cn.alignMiddle}>
        <div />
        <div>
          <Typography variant="h6" align="left" gutterBottom>
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

function YouTubeContent(props: ContentType) {
  return (
    <Grid container spacing={16} className={props.className}>
      <Grid item xs={6}>
        <div className={cn.responsive}>
          <iframe
            title={props.title}
            src={props.url}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </Grid>
      <Grid item xs={6} className={cn.alignMiddle}>
        <div />
        <div>
          <Typography variant="h6" align="left">
            {props.title}
          </Typography>
          <Typography variant="caption" align="left">
            {props.description}
          </Typography>
        </div>
        <div>
          {props.buttons.map((item, i) => (
            <Button {...item} key={i}>
              {item.children}
            </Button>
          ))}
        </div>
      </Grid>
    </Grid>
  );
}

export default Contents;
