// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { css } from 'emotion';

import theme from '../settings/theme';
import attention from '../resources/attention.png';
import no01 from '../resources/no01.png';
import no02 from '../resources/no02.png';
import no03 from '../resources/no03.png';

const reference = `https://firebasestorage.googleapis.com/v0/b/hackforplay-production.appspot.com/o/specials%2Freference.pdf?alt=media&token=22b71ece-3b6b-4d35-bb62-59e5223b3dad`;

const cn = {
  root: css({
    maxWidth: 840,
    paddingTop: theme.spacing.unit * 4,
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
    alignItems: 'center'
  }),
  paper: css({
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 4,
    '&:after': {
      content: '" "',
      display: 'block',
      whiteSpace: 'pre',
      marginBottom: theme.spacing.unit * -6
    }
  }),
  paragraph: css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 6
  }),
  img: css({
    alignSelf: 'flex-start',
    marginRight: theme.spacing.unit * 5
  }),
  button: css({
    marginRight: theme.spacing.unit * 2
  })
};

export default class ProgrammingColosseum extends React.Component<{}> {
  componentDidMount() {
    // async のテスト
    try {
      eval(`(async () => { await 1; })(); Object.entries({})`); // eslint-disable-line
    } catch (error) {
      alert(
        '申し訳ありませんが、このコンテンツはお使いのブラウザに対応していません。最新版のパソコン版 Google Chrome をインストールしてお使いください'
      );
      window.open('https://www.google.co.jp/chrome/index.html', '_blank');
    }
  }

  render() {
    return (
      <div className={cn.root}>
        <Paper elevation={1} className={cn.paper}>
          <div className={cn.paragraph}>
            <img src={attention} className={cn.img} alt="" />
            <Typography variant="title" color="error" align="left">
              始める前に必ずお読みください
            </Typography>
          </div>
          <div className={cn.paragraph}>
            <img src={no01} className={cn.img} alt="" />
            <div>
              <Typography variant="title" align="left" gutterBottom>
                リファレンスのダウンロード
              </Typography>
              <Typography variant="body1" align="left" gutterBottom>
                このゲームで使える全ての機能が書かれたリファレンスです。ゲームを始める前に、必ずダウンロードしてください。
              </Typography>
              <Button
                variant="raised"
                color="primary"
                component="a"
                download
                href={reference}
                className={cn.button}
              >
                ダウンロードする
              </Button>
              <Button
                variant="raised"
                color="default"
                target="_blank"
                href={reference}
                className={cn.button}
              >
                新しいタブで開く
              </Button>
            </div>
          </div>
          <div className={cn.paragraph}>
            <img src={no02} className={cn.img} alt="" />
            <div>
              <Typography variant="title" align="left" gutterBottom>
                ランキングついて
              </Typography>
              <Typography variant="body1" align="left" gutterBottom>
                ステージをクリアするとランキングに参加できます。
              </Typography>
              <Button
                variant="raised"
                color="primary"
                component={Link}
                to="/specials/プログラミングコロシアム/ranking/semi1"
              >
                ランキングを見る
              </Button>
            </div>
          </div>
          <div className={cn.paragraph}>
            <img src={no03} className={cn.img} alt="" />
            <div>
              <Typography variant="title" align="left" gutterBottom>
                レベルについて
              </Typography>
              <Typography variant="body1" align="left" gutterBottom>
                全部で4つのレベルが用意されています。まずはチュートリアルからやってみましょう
              </Typography>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}
