// @flow

// ダミー画像
import thumbnail from '../resources/stage6.jpeg';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'work';

type Action = {
  type: string
};

export type Work = {
  id: string,
  title: string,
  thumbnail: string,
  author: {
    id: string,
    name: string
  },
  date: string,
  playcount: number
};

export type State = {
  recommended: Array<Work>,
  trending: Array<Work>,
  byUserId: {
    [string]: Array<Work>
  },
  privates: Array<Work>
};

const initialState: State = {
  recommended: [
    {
      id: 'hogehoge',
      title: 'ゲームのタイトル',
      thumbnail,
      author: {
        id: 'hoge',
        name: 'Hoge'
      },
      date: '3ヶ月前',
      playcount: 100
    },
    {
      id: 'fugafuga',
      title: 'ゲームのタイトル',
      thumbnail,
      author: {
        id: 'fuga',
        name: 'Fuga'
      },
      date: '3ヶ月前',
      playcount: 100
    },
    {
      id: 'burabura',
      title: 'ゲームのタイトルゲームのタイトルゲームのタイトルゲームのタイトル',
      thumbnail,
      author: {
        id: 'bura',
        name: 'buraburaburaburaburaburaburaburaburaburaburaburaburabura'
      },
      date: '3ヶ月前',
      playcount: 100
    },
    {
      id: 'mugamuga',
      title: 'ゲームのタイトル',
      thumbnail,
      author: {
        id: 'muga',
        name: 'Muga'
      },
      date: '3ヶ月前',
      playcount: 100
    }
  ],
  trending: [
    {
      id: 'trendhogehoge',
      title: 'ダミーステージゲームのタイトル',
      thumbnail,
      author: {
        id: 'hoge',
        name: 'Hoge'
      },
      date: 'ついさっき',
      playcount: 100
    },
    {
      id: 'trendfugafuga',
      title: 'ダミーステージゲームのタイトル',
      thumbnail,
      author: {
        id: 'fuga',
        name: 'Fuga'
      },
      date: 'ついさっき',
      playcount: 100
    },
    {
      id: 'trendburabura',
      title:
        'ダミーステージゲームのタイトルゲームのタイトルゲームのタイトルゲームのタイトル',
      thumbnail,
      author: {
        id: 'bura',
        name: 'buraburaburaburaburaburaburaburaburaburaburaburaburabura'
      },
      date: '１日前',
      playcount: 100
    },
    {
      id: 'trendmugamuga',
      title: 'ダミーステージゲームのタイトル',
      thumbnail,
      author: {
        id: 'muga',
        name: 'Muga'
      },
      date: '１日前',
      playcount: 100
    }
  ],
  byUserId: {
    xxxxxxxx: [
      {
        id: 'byuserid',
        title: 'ダミーステージゲームのタイトル',
        thumbnail,
        author: {
          id: 'xxxxxxxx',
          name: 'ユーザー名'
        },
        date: '１日前',
        playcount: 100
      }
    ]
  },
  privates: []
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};

// Action Creators
