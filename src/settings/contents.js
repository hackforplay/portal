// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import type { Color } from '@material-ui/core/Button/Button';
import VideogameAsset from '@material-ui/icons/VideogameAsset';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import PlayArrow from '@material-ui/icons/PlayArrow';

import * as xlasses from '../utils/xlasses';
import thumbnail from '../resources/stage6.jpeg';

export type ContentType = {
  type: 'youtube' | 'stage',
  earlybird: boolean,
  title: string,
  author: null,
  description: string,
  image: string,
  url?: string,
  buttons: Array<{
    color?: Color,
    className: string,
    children?: string,
    disabled?: boolean,
    disableFocusRipple?: boolean,
    disableRipple?: boolean,
    fab?: boolean,
    fullWidth?: boolean,
    href?: string,
    mini?: boolean,
    variant?: 'contained' | 'text' | 'fab',
    type?: string,
    target?: '_blank'
  }>
};

const contents: Array<{ path: string, items: Array<ContentType> }> = [
  {
    path: '/contents/tutorial',
    items: [
      {
        type: 'stage',
        earlybird: false,
        title: 'はじまりのダンジョン',
        author: null,
        description:
          '体力9999のスライムに、ふれたら即GAMEOVERのブレス……クリアするには、プログラムを書きかえるしかない!!',
        image: thumbnail,
        url: '/officials/hack-rpg',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            className: xlasses.largeButton,
            children: [<PlayArrow key="icon" />, 'ゲームスタート'],
            component: Link,
            to: '/officials/hack-rpg'
          }
        ]
      }
    ]
  },
  {
    path: '/contents/youtube',
    items: [
      {
        type: 'youtube',
        earlybird: false,
        title: 'ステージ１ はじまりの森',
        author: null,
        description: 'まずはプレイヤーを動かしてみよう',
        image: '',
        url: 'https://www.youtube.com/embed/VDPRV91o984',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/VDPRV91o984',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'ステージ２ コードの魔法',
        author: null,
        description: '本のコードを書きかえてみよう',
        image: '',
        url: 'https://www.youtube.com/embed/Xvnw8kE-EXw',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/Xvnw8kE-EXw',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'ステージ３ 閉じられた群青の輝き',
        author: null,
        description: 'スライムの大群をやっつけるどうすればいいだろう？',
        image: '',
        url: 'https://www.youtube.com/embed/laR6MY6IiJQ',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/laR6MY6IiJQ',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'ステージ４ 大グモ荒野',
        author: null,
        description: 'どうすればダイヤモンドの所まで行けるだろう？',
        image: '',
        url: 'https://www.youtube.com/embed/sHlxu5U94U0',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/sHlxu5U94U0',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'ステージ５ 守りし者',
        author: null,
        description: 'これまで使ったスキルを全て使ってドラゴンを倒そう！',
        image: '',
        url: 'https://www.youtube.com/embed/yfwUHmf0DYA',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/yfwUHmf0DYA',
            target: '_blank'
          }
        ]
      }
    ]
  },
  {
    path: '/contents/kit',
    items: [
      {
        type: 'stage',
        earlybird: false,
        title: 'オリジナルステージが作れる！RPGキット',
        author: null,
        description: 'ハックフォープレイのステージを自分で作れるキットです⚔',
        image: 'https://assets.feeles.com/www/kit/screenshot-makerpg.png',
        url: '/officials/make-rpg',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            className: xlasses.largeButton,
            children: [<VideogameAsset key="icon" />, 'ステージをつくる'],
            component: Link,
            to: '/officials/make-rpg'
          },
          {
            className: xlasses.mediumButton,
            children: [<LibraryBooks key="icon" />, '逆引きリファレンス'],
            href:
              'https://www.notion.so/teramotodaiki/190dd152ace548c7a6d6ca11ac478920',
            target: '_blank'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: true,
        title: 'RPGキット2 (ベータ版)',
        author: null,
        description: 'ベータ版です',
        image: 'https://assets.feeles.com/www/kit/screenshot-makerpg.png',
        url: '/officials/make-rpg-2',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'ためしてみる (β)',
            component: Link,
            to: '/officials/make-rpg-2'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: true,
        title: 'RPGキットのマップを作ろう！（ベータ版）',
        author: null,
        description: 'マップをデザインしてステージで使うことができます',
        image: 'https://i.gyazo.com/bace7786ec37a46b8ccb673563f2fda9.png',
        url: '/map-editor',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'マップをつくる',
            component: Link,
            to: '/map-editor'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'オリジナルゲームをつくろう！',
        author: null,
        description:
          'オリジナルゲームを作って投稿することができます。まずは始め方を解説します',
        image: '',
        url: 'https://www.youtube.com/embed/cXJj6X8gnFc',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/cXJj6X8gnFc',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'スキンをかえてみよう！',
        author: null,
        description: 'スキンを使うとキャラクターの見た目を変えられます',
        image: '',
        url: 'https://www.youtube.com/embed/CJ0FSvQ_oTs',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/CJ0FSvQ_oTs',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'スキルをつかってみよう！',
        author: null,
        description:
          'スキルを使うとキャラクターが技を使えるようになったり能力を上げることができます',
        image: '',
        url: 'https://www.youtube.com/embed/r3yvl19rnS0',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/r3yvl19rnS0',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'モンスターをだそう！',
        author: null,
        description: 'モンスターやアイテムなども自由に出すことができます',
        image: '',
        url: 'https://www.youtube.com/embed/Oin5IV3Ldww',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/Oin5IV3Ldww',
            target: '_blank'
          }
        ]
      }
      // {
      //   type: 'youtube',
      //   title: 'ゲームを公開してみよう！',
      //   author: null,
      //   description:
      //     'ゲームを公開すれば世界中の人がそのゲームを遊べるようになります',
      //   image: '',
      //   url: 'https://www.youtube.com/embed/UvTzW4OmOko',
      //   buttons: [
      //     {
      //       children: 'YouTube で見る',
      //       href: 'https://youtu.be/UvTzW4OmOko',
      //       target: '_blank'
      //     }
      //   ]
      // }
      // {
      //   title: 'モノの動きシミュレータ',
      //   author: null,
      //   description:
      //     'MatterJS（マタージェーエス）を使って色んな動きをプログラミングできます💨',
      //   image:
      //     'https://assets.feeles.com/thumbnail/7c36c597ca8ae2e5cf13f738508bf9b5.jpg',
      //   url: 'http://kits.feeles.com/matterjs.html',
      //   docs: 'http://brm.io/matter-js/docs/'
      // },
      // {
      //   title: '会話作り',
      //   author: null,
      //   description:
      //     'どなたか、私と会話してくれませんか？　もしも会話をプログラミングできたら… 💭 (Google Chrome推奨)',
      //   image: 'https://i.gyazo.com/5f23eb2635a69a3c4b0c4b9ee1a9ae37.png',
      //   url: 'http://kits.feeles.com/ask.html',
      //   docs: ''
      // }
    ]
  },
  {
    path: '/specials/プログラミングコロシアム',
    items: [
      {
        type: 'youtube',
        earlybird: false,
        title: 'まずはこの動画を見よう！',
        author: null,
        description: 'プログラミングコロシアム特設ステージの遊び方を紹介します',
        image: '',
        url: 'https://www.youtube.com/embed/0KtAuJKdI8c',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/0KtAuJKdI8c',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: 'コードを書いて魔法使いを動かす方法',
        author: null,
        description: 'チュートリアルのプレイ方法を紹介します',
        image: '',
        url: 'https://www.youtube.com/embed/KKHgSGIt2-4',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/KKHgSGIt2-4',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        earlybird: false,
        title: '繰り返しのコードを使ってスコア1000点を出す方法',
        author: null,
        description: 'チュートリアルのクリア方法を紹介します',
        image: '',
        url: 'https://www.youtube.com/embed/QJZOTBkTAE0',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/QJZOTBkTAE0',
            target: '_blank'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: false,
        title: 'チュートリアル',
        image:
          'https://assets.feeles.com/thumbnail/6641e6ff291706f48f83a7b6a3acab9d.jpg',
        author: null,
        description: '制限時間のない練習用のステージです',
        url: '/officials/pg-colosseum/#/training/index.html',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'スタート',
            component: Link,
            to: '/officials/pg-colosseum/#/training/index.html'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: false,
        title: '準決勝戦',
        image:
          'https://assets.feeles.com/thumbnail/658428ea0da32c66008d4067793fda09.jpg',
        author: null,
        description: '準決勝戦に使われたステージです',
        url: '/officials/pg-colosseum/#/stages/semi/index.html',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'はじめから',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/semi/index.html'
          },
          {
            variant: 'contained',
            children: 'ステージ２',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/semi2/index.html'
          },
          {
            variant: 'contained',
            children: 'ステージ３',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/semi3/index.html'
          }
        ]
      },

      {
        type: 'stage',
        earlybird: false,
        title: '決勝',
        image:
          'https://assets.feeles.com/thumbnail/b67621fc40f25635649510377d632cb8.jpg',
        author: null,
        description: '決勝戦に使われたステージです',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'はじめから',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/final/index.html'
          },
          {
            variant: 'contained',
            children: 'ステージ２',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/final2/index.html'
          },
          {
            variant: 'contained',
            children: 'ステージ３',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/final3/index.html'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: false,
        title: 'グランドチャンピオン決定戦',
        image:
          'https://assets.feeles.com/thumbnail/f7c34971cda6bd0df9dc8713ed51ce55.jpg',
        author: null,
        description: '最終決戦に使われたステージです',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'はじめから',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/champion/index.html'
          },
          {
            variant: 'contained',
            children: 'ステージ２',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/slot2/index.html'
          },
          {
            variant: 'contained',
            children: 'ステージ３',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/danmaku3/index.html'
          }
        ]
      }
    ]
  },
  {
    path: '/specials/プログラミングコロシアム2018',
    items: [
      {
        type: 'stage',
        earlybird: false,
        title: 'れんしゅうステージ',
        image: 'https://i.gyazo.com/60cfa51509c815a713be7a38d8d547d6.gif',
        author: null,
        description: 'まずは、このステージで、あそびかたをおぼえよう！',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'プレイ',
            component: Link,
            to: '/officials/pg-colosseum-2018/training'
          },
          {
            children: '答え',
            href:
              'https://scrapbox.io/hackforplay/%E3%83%AD%E3%83%83%E3%82%AF%E3%83%9E%E3%83%B3%E3%81%AE%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C',
            target: '_blank'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: false,
        title: 'ステージ１【vsエアーマン】',
        image: 'https://i.gyazo.com/93539dd4f2f2612059c881b2a937d065.gif',
        author: null,
        description: 'ロックマンといっしょにたたかおう！',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'プレイ',
            component: Link,
            to: '/officials/pg-colosseum-2018/yosen-1-FRhtfFzG'
          },
          {
            children: '答え',
            href: 'https://www.notion.so/63c3ecb229b64e45a4a301d9f9894b5f',
            target: '_blank'
          }
        ]
      },
      {
        type: 'stage',
        earlybird: false,
        title: 'ステージ２【vsイエローデビル】',
        image: 'https://i.gyazo.com/19c764093668c23ed36f46a02c1698f7.gif',
        author: null,
        description: 'ロックマンといっしょにたたかおう！',
        buttons: [
          {
            variant: 'contained',
            color: 'primary',
            children: 'プレイ',
            component: Link,
            to: '/officials/pg-colosseum-2018/yosen-2-LKSm5H9D'
          },
          {
            children: '答え',
            href: 'https://www.notion.so/63c3ecb229b64e45a4a301d9f9894b5f',
            target: '_blank'
          }
        ]
      }
    ]
  }
];

export default contents;
