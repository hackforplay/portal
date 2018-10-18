// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { style } from 'typestyle';

import { withTheme } from '@material-ui/core/styles';
import attention from '../resources/attention.png';
import no01 from '../resources/no01.png';
import no02 from '../resources/no02.png';
import no03 from '../resources/no03.png';

const reference = `https://firebasestorage.googleapis.com/v0/b/hackforplay-production.appspot.com/o/specials%2Freference.pdf?alt=media&token=22b71ece-3b6b-4d35-bb62-59e5223b3dad`;

const getCn = props => ({
  root: style({
    maxWidth: 840,
    paddingTop: props.theme.spacing.unit * 4,
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
    alignItems: 'center'
  }),
  paper: style({
    width: '100%',
    boxSizing: 'border-box',
    padding: props.theme.spacing.unit * 6,
    marginBottom: props.theme.spacing.unit * 4,
    $nest: {
      '&::after': {
        content: '" "',
        display: 'block',
        whiteSpace: 'pre',
        marginBottom: props.theme.spacing.unit * -6
      }
    }
  }),
  paragraph: style({
    display: 'flex',
    alignItems: 'center',
    marginBottom: props.theme.spacing.unit * 6
  }),
  img: style({
    alignSelf: 'flex-start',
    marginRight: props.theme.spacing.unit * 5
  }),
  button: style({
    marginRight: props.theme.spacing.unit * 2
  })
});

@withTheme()
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
    const dcn = getCn(this.props);

    return (
      <div className={dcn.root}>
        <Paper elevation={1} className={dcn.paper}>
          <div className={dcn.paragraph}>
            <img src={attention} className={dcn.img} alt="" />
            <Typography variant="title" color="error" align="left">
              始める前に必ずお読みください
            </Typography>
          </div>
          <div className={dcn.paragraph}>
            <img src={no01} className={dcn.img} alt="" />
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
                className={dcn.button}
              >
                ダウンロードする
              </Button>
              <Button
                variant="raised"
                color="default"
                target="_blank"
                href={reference}
                className={dcn.button}
              >
                新しいタブで開く
              </Button>
            </div>
          </div>
          <div className={dcn.paragraph}>
            <img src={no02} className={dcn.img} alt="" />
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
          <div className={dcn.paragraph}>
            <img src={no03} className={dcn.img} alt="" />
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
