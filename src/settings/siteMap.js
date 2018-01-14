export const searchBarInfo = [
  {
    path: '/contents/kit',
    text: 'クリエイト',
    tabs: []
  },
  {
    path: '/contents/(.*)',
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
    path: '/lists(.*)',
    text: 'ゲームプレイ',
    tabs: []
  }
];
