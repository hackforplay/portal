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
      },
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
      }
    ]
  }
];
