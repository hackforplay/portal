// @flow
import { Link } from 'react-router-dom';

import thumbnail from '../resources/stage6.jpeg';

export type ContentType = {
  type: 'youtube' | 'stage',
  title: string,
  author: null,
  description: string,
  image: string,
  url: string,
  buttons: Array<{
    color?: string,
    children?: string,
    disabled?: boolean,
    disableFocusRipple?: boolean,
    disableRipple?: boolean,
    fab?: boolean,
    fullWidth?: boolean,
    href?: string,
    mini?: boolean,
    raised?: boolean,
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
        title: 'はじまりのダンジョン',
        author: null,
        description:
          '体力9999のスライムに、ふれたら即GAMEOVERのブレス……クリアするには、プログラムを書きかえるしかない!!',
        image: thumbnail,
        url: 'https://hack-rpg.hackforplay.xyz',
        buttons: [
          {
            raised: true,
            color: 'primary',
            children: 'ゲームスタート',
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
        title: 'ゲームが作れる！RPGキット',
        author: null,
        description: 'ハックフォープレイのステージを自分で作れるキットです⚔',
        image: 'https://assets.feeles.com/www/kit/screenshot-makerpg.png',
        url: '/officials/make-rpg',
        buttons: [
          {
            raised: true,
            color: 'primary',
            children: 'ゲームをつくる',
            component: Link,
            to: '/officials/make-rpg'
          },
          {
            raised: true,
            children: 'ドキュメント',
            href: 'https://github.com/Feeles/RPG/wiki',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
        title: 'オリジナルゲームをつくろう！',
        author: null,
        description:
          'オリジナルゲームを作って投稿することができます。まずは始め方を解説します',
        image: '',
        url: 'https://www.youtube.com/embed/q4QgA2G63h0',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/q4QgA2G63h0',
            target: '_blank'
          }
        ]
      },
      {
        type: 'youtube',
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
      },
      {
        type: 'youtube',
        title: 'ゲームを公開してみよう！',
        author: null,
        description:
          'ゲームを公開すれば世界中の人がそのゲームを遊べるようになります',
        image: '',
        url: 'https://www.youtube.com/embed/UvTzW4OmOko',
        buttons: [
          {
            children: 'YouTube で見る',
            href: 'https://youtu.be/UvTzW4OmOko',
            target: '_blank'
          }
        ]
      }
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
        type: 'stage',
        title: 'チュートリアル',
        image:
          'https://assets.feeles.com/thumbnail/6641e6ff291706f48f83a7b6a3acab9d.jpg',
        author: null,
        description: '制限時間のない練習用のステージです',
        url: '/officials/pg-colosseum/#/training/index.html',
        buttons: [
          {
            raised: true,
            color: 'primary',
            children: 'スタート',
            component: Link,
            to: '/officials/pg-colosseum/#/training/index.html'
          }
        ]
      },
      {
        type: 'stage',
        title: '準決勝戦',
        image:
          'https://assets.feeles.com/thumbnail/658428ea0da32c66008d4067793fda09.jpg',
        author: null,
        description: '準決勝戦に使われたステージです',
        url: '/officials/pg-colosseum/#/stages/semi/index.html',
        buttons: [
          {
            raised: true,
            color: 'primary',
            children: 'スタート',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/semi/index.html'
          }
        ]
      },

      {
        type: 'stage',
        title: '決勝',
        image:
          'https://assets.feeles.com/thumbnail/b67621fc40f25635649510377d632cb8.jpg',
        author: null,
        description: '決勝戦に使われたステージです',
        url: '/officials/pg-colosseum/#/stages/final/index.html',
        buttons: [
          {
            raised: true,
            color: 'primary',
            children: 'スタート',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/final/index.html'
          }
        ]
      },
      {
        type: 'stage',
        title: 'グランドチャンピオン決定戦',
        image:
          'https://assets.feeles.com/thumbnail/f7c34971cda6bd0df9dc8713ed51ce55.jpg',
        author: null,
        description: '最終決戦に使われたステージです',
        url: '/officials/pg-colosseum/#/stages/champion/index.html',
        buttons: [
          {
            raised: true,
            color: 'primary',
            children: 'スタート',
            component: Link,
            to: '/officials/pg-colosseum/#/stages/champion/index.html'
          }
        ]
      }
    ]
  }
];

export default contents;
