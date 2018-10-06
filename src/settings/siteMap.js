// @flow
export const searchBarInfo = [
  {
    path: '/contents/kit',
    text: 'ステージを作る',
    tabs: []
  },
  {
    path: '/contents/:tab?',
    text: '',
    tabs: [
      {
        text: 'あそびかた',
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
    text: 'みんなのステージ',
    tabs: []
  },
  {
    path: '/users/:id/edit',
    text: 'プロフィールを編集',
    tabs: []
  },
  {
    path: '/users/:id/:tab?/:query?',
    text: '',
    tabs: [
      {
        text: 'ステージ',
        to: '/users/:id'
      },
      {
        text: 'マップ',
        to: '/users/:id/maps'
      } /*,
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
    backTo: '/specials/プログラミングコロシアム',
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
    headline: 'ハックフォープレイのあそびかた',
    caption:
      'まずは下の「ゲームスタート」をクリックして、あそびかたをマスターしよう'
  },
  {
    path: '/contents/youtube',
    headline: 'HackforPlay の使い方を YouTube でしらべよう',
    caption: 'YouTube を見て、きほんの使い方をマスターしよう'
  },
  {
    path: '/contents/kit',
    headline: 'ステージを作ってみよう',
    caption: 'きみもオリジナルステージを作って、ゲームクリエイターになろう！'
  },
  {
    path: '/lists',
    headline: 'おもしろいステージをさがそう',
    caption:
      'ここにあるのはすべて子どもたちが作ったステージ。たくさん遊んで好きなステージをさがしてみよう。きみの作品のヒントになるかもよ'
  }
];
