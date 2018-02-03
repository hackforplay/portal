// @flow
import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import theme from '../settings/theme';
import WorkList from '../containers/WorkList';
import topbackUrl from '../resources/topback.jpg';
import toplogoUrl from '../resources/toplogo_ja.png';
import beginner from '../resources/beginner.png';
import diamond_pink from '../resources/diamond_pink.png';
import mail from '../resources/mail.png';
import facebook from '../resources/facebook.png';
import twitter from '../resources/twitter.png';
// import thumbnailUrl from '../resources/thumbnail.jpg';
import type { WorkCollectionType } from '../ducks/work';

type Props = {
  classes: {
    workList: string,
    button: string,
    paper: string,
    title: string
  },
  trending: WorkCollectionType
};

@withStyles({
  workList: {
    margin: theme.spacing.unit * 2,
    textAlign: 'center',
    flexGrow: 1
  },
  button: {
    fontSize: 'large',
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4
  },
  paper: {
    flex: '0 1 100%',
    padding: 60,
    textAlign: 'center',
    margin: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center'
  }
})
class Topic extends React.Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div style={{ backgroundColor: '#e1e5f9' }}>
        <Slider dots infinite lazyLoad arrows={false}>
          <div
            style={{
              position: 'relative',
              height: 480,
              width: '100%',
              backgroundImage: `url(${topbackUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                textAlign: 'center'
              }}
            >
              <img
                src={toplogoUrl}
                alt="Hack for Play"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  paddingTop: 60
                }}
              />
            </div>
          </div>
        </Slider>
        <div style={{ marginBottom: 32 }} />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Paper elevation={1} className={classes.paper}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={beginner} alt="" />
                <div style={{ marginLeft: 16 }}>
                  <Typography type="subheading" align="left" gutterBottom>
                    HackforPlayとは？
                  </Typography>
                  <Typography type="title" align="left" gutterBottom>
                    はじめてプレイする方はこちら
                  </Typography>
                </div>
              </div>
              <Button
                color="primary"
                raised
                target="_blank"
                href="http://hack-rpg.hackforplay.xyz"
                className={classes.button}
                style={{ marginTop: 16 }}
              >
                チュートリアル
              </Button>
            </Paper>
          </Grid>

          <WorkList
            works={this.props.trending}
            title={
              <Typography
                type="title"
                align="center"
                gutterBottom
                className={classes.title}
              >
                <img src={diamond_pink} alt="" />
                はじめてプレイする方はこちら
              </Typography>
            }
            moreLink="/lists/trending"
            className={classes.workList}
          />
          {/* <Paragraph md={6}>
            <Typography type="body2" gutterBottom>
              タイトル
            </Typography>
            <Typography type="body1" gutterBottom>
              {'テキスト'.repeat(20)}
            </Typography>
            <Button color="primary" raised>
              もっと読む
            </Button>
          </Paragraph>
          <Paragraph md={6}>
            <Typography type="headline" gutterBottom>
              ワークショップ情報
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography type="body1">{'text '.repeat(20)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <img src={thumbnailUrl} alt="" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" raised>
                  チュートリアル
                </Button>
              </Grid>
            </Grid>
          </Paragraph> */}
          <Grid item xs={12}>
            <Paper
              elevation={1}
              style={{
                flex: '0 1 100%',
                padding: 60,
                textAlign: 'center',
                margin: 16
              }}
            >
              <div>
                <Typography
                  type="title"
                  align="center"
                  gutterBottom
                  className={classes.title}
                >
                  <img src={mail} alt="" />
                  お問い合わせ
                </Typography>
              </div>
              <Button
                color="primary"
                raised
                href="https://goo.gl/forms/S655BeMUpNHjmAtg1"
                target="_blank"
                className={classes.button}
              >
                お問い合わせはこちら
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Topic;
