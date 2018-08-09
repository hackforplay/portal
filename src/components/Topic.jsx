// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { css } from 'emotion';

import theme from '../settings/theme';
import WorkList from '../containers/WorkList';
import beginner from '../resources/beginner.png';
import diamond_pink from '../resources/diamond_pink.png';
import mail from '../resources/mail.png';
import dragon from '../resources/dragon.png';
import facebook from '../resources/facebook.png';
import twitter from '../resources/twitter.png';
import logo from '../resources/logo.png';
import top1 from '../resources/h4p_top_01.gif';
import top2 from '../resources/h4p_top_02.gif';
import top3 from '../resources/h4p_top_03.gif';
import type { StateProps, DispatchProps } from '../containers/Topic';

const classes = {
  root: css({
    maxWidth: 840,
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 32
  }),
  slider: css({
    '& .slick-prev': {
      left: 25,
      zIndex: 1
    },
    '& .slick-next': {
      right: 25,
      zIndex: 1
    }
  }),
  sliderItem: css({
    position: 'relative',
    height: 480,
    maxHeight: '50vh',
    width: '100%',
    objectFit: 'cover',
    // https://github.com/bfred-it/object-fit-images/
    fontFamily: "'object-fit: contain;'"
  }),
  workList: css({
    textAlign: 'center'
  }),
  button: css({
    fontSize: 'large',
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4
  }),
  paper: css({
    flex: '0 1 100%',
    padding: 60,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box'
  }),
  title: css({
    display: 'inline-flex',
    alignItems: 'center'
  }),
  icon: css({
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }),
  body: css({
    alignSelf: 'left',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 4
  }),
  iframe: css({
    width: '100%',
    height: '100%'
  })
};

export type Props = StateProps & DispatchProps;

export default (props: Props) => {
  return (
    <div>
      <Slider
        dots
        infinite
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay
        autoplaySpeed={10000}
        className={classes.slider}
      >
        <img
          src={top1}
          alt={`スライムがたおせない！？これは・・・バグっているね！`}
          className={classes.sliderItem}
        />
        <img
          src={top2}
          alt={`本をひらいてみよう。おかしいのはどこ？`}
          className={classes.sliderItem}
        />
        <img
          src={top3}
          alt={`プログラミングで、せかいをかきかえてみよう！`}
          className={classes.sliderItem}
        />
      </Slider>
      <div className={classes.root}>
        <Grid container spacing={24}>
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
                component={Link}
                to="/officials/hack-rpg"
                className={classes.button}
                style={{ marginTop: 16 }}
              >
                ゲームスタート
              </Button>
            </Paper>
          </Grid>

          {/* プログラミングコロシアム */}
          <Grid item xs={12}>
            <Paper elevation={1} className={classes.paper}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={dragon} alt="" />
                <div style={{ marginLeft: 16 }}>
                  <Typography type="title" align="left" gutterBottom>
                    プログラミングコロシアム特別ステージ
                  </Typography>
                </div>
              </div>
              <Grid
                container
                justify="center"
                spacing={16}
                style={{ marginTop: 8, marginBottom: 8, height: 212 }}
              >
                <Grid item sm={6} xs={12}>
                  <iframe
                    title="procolo-1"
                    src="https://www.youtube.com/embed/viUpCZXjbVc"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className={classes.iframe}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <img
                    src="https://assets.feeles.com/thumbnail/7af083af9079fc370610d0e688c073d3.jpg"
                    alt="練習用ステージ"
                    style={{ height: '100%' }}
                  />
                </Grid>
              </Grid>
              <Typography type="title" align="left" gutterBottom>
                今年のプログラミングコロシアムは、ロックマン©︎とコラボ！
              </Typography>
              <Typography type="body1" align="left" gutterBottom>
                プログラムを使ってロックマン©︎を動かそう。コマンドの一覧は<a
                  href="https://scrapbox.io/hackforplay/%E3%83%AD%E3%83%83%E3%82%AF%E3%83%9E%E3%83%B3%E3%81%AE%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ここをクリック
                </a>すれば見ることができるぞ
              </Typography>
              <Typography type="caption" align="left">
                ※ロックマンは株式会社カプコンの登録商標です
              </Typography>
              <Button
                color="primary"
                raised
                component={Link}
                to="/officials/pg-colosseum-2018/training"
                className={classes.button}
                style={{ marginTop: 16 }}
              >
                ゲームスタート
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <WorkList
              works={props.trending}
              title={
                <Typography
                  type="title"
                  align="center"
                  gutterBottom
                  className={classes.title}
                >
                  <img src={diamond_pink} alt="" />
                  人気のステージ
                </Typography>
              }
              more={false}
              moreLink="/lists/trending"
              className={classes.workList}
              showVisibility={false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <iframe
              title="facebook"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fhackforplay%2F&tabs=timeline&width=380&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=481203238698048"
              width="408"
              height="500"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameborder="0"
              allowTransparency="true"
              allow="encrypted-media"
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <Paper elevation={1} className={classes.paper}>
              <Typography
                type="title"
                align="center"
                gutterBottom
                className={classes.title}
              >
                <img src={info} alt="" />
                ワークショップ情報
              </Typography>
              <img
                src={fest1}
                alt=""
                style={{ width: '100%', maxWidth: 500 }}
              />
              <img
                src={fest2}
                alt=""
                style={{ width: '100%', maxWidth: 500 }}
              />
              <Typography
                type="subheading"
                className={classes.body}
                gutterBottom
              >
                第６回金沢市キッズプログラミング教室が開催されます
              </Typography>
              <Button
                color="primary"
                raised
                href="http://www4.city.kanazawa.lg.jp/17009/kidspg.html"
                className={classes.button}
              >
                詳細はこちら
              </Button>
            </Paper>
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <Paper elevation={1} className={classes.paper}>
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
              <div>
                <img src={logo} height={60} alt="ハックフォープレイ株式会社" />
              </div>
              <div>
                <a href="https://twitter.com/teramotodaiki">
                  <img src={twitter} className={classes.icon} alt="Twitter" />
                </a>
                <a href="https://www.facebook.com/hackforplay">
                  <img src={facebook} className={classes.icon} alt="Facebook" />
                </a>
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
    </div>
  );
};
