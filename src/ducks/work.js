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
    name: string
  },
  date: string,
  playcount: number
};

export type State = {
  recommended: Array<Work>,
  trending: Array<Work>
};

const initialState: State = {
  recommended: [
    {
      id: 'hogehoge',
      title: 'ゲームのタイトル',
      thumbnail,
      author: {
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
        name: 'Muga'
      },
      date: '１日前',
      playcount: 100
    }
  ]
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};

// Action Creators
