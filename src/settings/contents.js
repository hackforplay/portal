// @flow
import thumbnail from '../resources/stage6.jpeg';

export type ContentType = {
  title: string,
  author: null,
  description: string,
  image: string,
  url: string,
  buttons: Array<{
    color?: string,
    children?: string,
    dense?: boolean,
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

export const tutorial: Array<ContentType> = [
  {
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
        target: '_blank',
        href: 'https://hack-rpg.hackforplay.xyz'
      }
    ]
  }
];

export const youtube: Array<ContentType> = [
  {
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
  },
  {
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
];

export const kit: Array<ContentType> = [
  {
    title: 'ゲームが作れる！RPGキット',
    author: null,
    description: 'ハックフォープレイのステージを自分で作れるキットです⚔',
    image: 'https://assets.feeles.com/www/kit/screenshot-makerpg.png',
    url: 'https://make-rpg.hackforplay.xyz',
    buttons: [
      {
        raised: true,
        color: 'primary',
        children: 'ゲームをつくる',
        href: 'https://make-rpg.hackforplay.xyz'
      },
      {
        raised: true,
        children: 'ドキュメント',
        href: 'https://github.com/Feeles/RPG/wiki',
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
];
