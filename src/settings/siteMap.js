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
    path: '/lists/search/:query?',
    text: '検索',
    tabs: [],
    backTo: '/lists'
  },
  {
    path: '/lists/:tab?',
    searchTo: '/lists/search',
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
  },
  {
    path: '/specials/プログラミングコロシアム/ranking/:stage',
    text: '',
    tabs: [
      {
        text: '準決勝１',
        to: '/specials/プログラミングコロシアム/ranking/semi1'
      },
      {
        text: '準決勝２',
        to: '/specials/プログラミングコロシアム/ranking/semi2'
      },
      {
        text: '準決勝３',
        to: '/specials/プログラミングコロシアム/ranking/semi3'
      },
      {
        text: '決勝１',
        to: '/specials/プログラミングコロシアム/ranking/final1'
      },
      {
        text: '決勝２',
        to: '/specials/プログラミングコロシアム/ranking/final2'
      },
      {
        text: '決勝３',
        to: '/specials/プログラミングコロシアム/ranking/final3'
      },
      {
        text: 'グラチャン１',
        to: '/specials/プログラミングコロシアム/ranking/grand1'
      },
      {
        text: 'グラチャン２',
        to: '/specials/プログラミングコロシアム/ranking/grand2'
      },
      {
        text: 'グラチャン３',
        to: '/specials/プログラミングコロシアム/ranking/grand3'
      }
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
