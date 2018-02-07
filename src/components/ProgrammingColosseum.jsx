// @flow
import * as React from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import attention from '../resources/attention.png';
import no01 from '../resources/no01.png';
import no02 from '../resources/no02.png';
import no03 from '../resources/no03.png';

type Props = {
  classes: {
    root: string,
    paper: string,
    paragraph: string,
    img: string
  }
};

@withStyles({
  root: {
    maxWidth: 800,
    padding: theme.spacing.unit * 4,
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  paper: {
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing.unit * 6,
    '&:after': {
      content: '" "',
      display: 'block',
      whiteSpace: 'pre',
      marginBottom: theme.spacing.unit * -6
    }
  },
  paragraph: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 6
  },
  img: {
    alignSelf: 'flex-start',
    marginRight: theme.spacing.unit * 5
  }
})
export default class ProgrammingColosseum extends React.Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={1} className={classes.paper}>
          <div className={classes.paragraph}>
            <img src={attention} className={classes.img} alt="" />
            <Typography type="title" color="error" align="left">
              始める前に必ずお読みください
            </Typography>
          </div>
          <div className={classes.paragraph}>
            <img src={no01} className={classes.img} alt="" />
            <div>
              <Typography type="title" align="left" gutterBottom>
                リファレンスのダウンロード
              </Typography>
              <Typography type="body1" align="left" gutterBottom>
                このゲームで使える全ての機能が書かれたリファレンスです。ゲームを始める前に、必ずダウンロードしてください。
              </Typography>
              <Button raised color="primary">
                ダウンロード
              </Button>
            </div>
          </div>
          <div className={classes.paragraph}>
            <img src={no02} className={classes.img} alt="" />
            <div>
              <Typography type="title" align="left" gutterBottom>
                ランキングついて
              </Typography>
              <Typography type="body1" align="left" gutterBottom>
                ステージをクリアするとランキングに参加できます。
              </Typography>
              <Button raised color="primary">
                ランキングを見る
              </Button>
            </div>
          </div>
          <div className={classes.paragraph}>
            <img src={no03} className={classes.img} alt="" />
            <div>
              <Typography type="title" align="left" gutterBottom>
                レベルについて
              </Typography>
              <Typography type="body1" align="left" gutterBottom>
                全部で4つのレベルが用意されています。まずはチュートリアルからやってみましょう
              </Typography>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}
