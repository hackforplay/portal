// @flow
import type { WorkItemType } from '../ducks/work';

const makeItem = (asset_url = ''): WorkItemType => ({
  isAvailable: true,
  isProcessing: false,
  isEmpty: false,
  isInvalid: false,
  data: {
    id: '', // Document ID
    path: '', // Page path
    title: '',
    description: '',
    asset_url,
    // additional structure
    visibility: 'public',
    viewsNum: 0,
    favsNum: 0,
    clearRate: 0,
    createdAt: '',
    updatedAt: null
  }
});

type officialsType = Array<{
  path: string,
  replayable: boolean,
  work: WorkItemType
}>;

const officials: officialsType = [
  {
    path: '/officials/hack-rpg',
    replayable: false,
    work: makeItem(
      'https://corporate-203c7.firebaseapp.com/hack-rpg/index.json'
    )
  },
  {
    path: '/officials/make-rpg',
    replayable: true,
    work: makeItem(
      'https://corporate-203c7.firebaseapp.com/make-rpg/index.json'
    )
  },
  {
    path: '/officials/pg-colosseum',
    replayable: false,
    work: makeItem('https://pg-colosseum.hackforplay.xyz/make-rpg.json')
  }
];

export default officials;
