import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import topbackUrl from '../resources/topback.jpg';
import toplogoUrl from '../resources/toplogo_ja.png';
import thumbnailUrl from '../resources/thumbnail.jpg';

const styles = {};

function Topic() {
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
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <img
              src={toplogoUrl}
              alt="Hack for Play"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingTop: 60,
              }}
            />
          </div>
        </div>
        <h1>1</h1>
        <h1>2</h1>
        <h1>3</h1>
      </Slider>
      <div style={{ marginBottom: 32 }} />
      <Grid container spacing={0}>
        <Paragraph>
          <Typography type="headline" align="center" gutterBottom>
            初めての方はこちら
          </Typography>
          <Button color="primary" raised href="http://hack-rpg.hackforplay.xyz">
            チュートリアル
          </Button>
        </Paragraph>
        <Paragraph>
          <Typography type="headline" align="center" gutterBottom>
            おすすめのゲーム
          </Typography>
          <Grid container justify="center" spacing={24}>
            {Array.from({ length: 8 }).map((_, key) => (
              <Grid item key={key}>
                <Product title="タイトル" playcount={6} />
              </Grid>
            ))}
          </Grid>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button color="primary" raised>
              もっと見る
            </Button>
          </div>
        </Paragraph>
        <Paragraph md={6}>
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
        </Paragraph>
        <Paragraph>
          <Typography type="headline" gutterBottom>
            お問い合わせ
          </Typography>
          <Button color="primary" raised>
            お問い合わせはこちら
          </Button>
        </Paragraph>
      </Grid>
    </div>
  );
}

type ProductProps = {
  title: string,
  playcount: number,
};

function Product({ title, playcount }: ProductProps) {
  return (
    <div style={{ width: 280 }}>
      <img src={thumbnailUrl} alt="" style={{ width: '100%' }} />
      <Typography type="body2">{title}</Typography>
      <Typography type="caption" gutterBottom>
        {`プレイ回数 ${playcount}回`}
      </Typography>
    </div>
  );
}

type ParagraphProps = {
  children: React.Node,
  md: Number,
};

const Paragraph = ({ children, md }: ParagraphProps) => (
  <Grid item xs={12} md={md}>
    <Paper
      elevation={1}
      style={{
        flex: '0 1 100%',
        padding: 60,
        textAlign: 'center',
        margin: 16,
      }}
    >
      {children}
    </Paper>
  </Grid>
);

Paragraph.defaultProps = {
  md: 12,
};

export default withStyles(styles)(Topic);
