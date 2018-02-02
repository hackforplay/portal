export const searchBarInfo = [
  {
    path: '/contents/kit',
    text: 'クリエイト',
    tabs: []
  },
  {
    path: '/contents/:tab?',
    text: '',
    tabs: [
      {
        text: 'チュートリアル',
        to: '/contents/tutorial'
      },
      {
        text: 'YouTube',
        to: '/contents/youtube'
      }
    ]
  },
  {
    path: '/lists/:tab?/:query?',
    text: 'ゲームプレイ',
    tabs: []
  },
  {
    path: '/users/:id/:tab?/:query?',
    text: '',
    tabs: [
      {
        text: '投稿済み',
        to: '/users/:id'
      } /*,
      {
        text: '保存済み',
        to: '/users/:id/private'
      },
      {
        text: 'お気に入り',
        to: '/users/:id/likes'
      },
      {
        text: 'フォロー',
        to: '/users/:id/following'
      },
      {
        text: 'フォロワー',
        to: '/users/:id/followers'
      }*/
    ]
  }
];

export const optionalHeaderInfo = [
  {
    path: '/contents/tutorial',
    headline: 'チュートリアルをプレイして使い方を学ぼう',
    caption:
      'まずは下の「ゲームスタート」をクリックしてチュートリアルをやってみよう'
  },
  {
    path: '/contents/youtube',
    headline: 'HackforPlay の使い方を動画で学ぼう',
    caption: 'チュートリアルのプレイ動画を見て、基本的な使い方をマスターしよう'
  },
  {
    path: '/contents/kit',
    headline: 'ゲームを作ってみよう',
    caption: 'きみもオリジナルゲームを作ってクリエイターになろう！'
  },
  {
    path: '/lists',
    headline: 'みんなの作品をプレイしてみよう',
    caption:
      'ここにあるのはすべてユーザーの作品。たくさん遊んで好きなゲームをさがしてみよう'
  }
];
