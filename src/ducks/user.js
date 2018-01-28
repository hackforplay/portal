// @flow

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'user';

// TODO: 実際にはページングやクエリに対応する ActionType が必要
const LOAD = 'portal/user/LOAD';
const CREATE = 'portal/user/CREATE';
const UPDATE = 'portal/user/UPDATE';
const REMOVE = 'portal/user/REMOVE';

type UserType = {
  id: string,
  displayName: string,
  worksNum: number
};

type ActionType = {
  type: string,
  user?: UserType
};

export type State = {
  byUserId: {
    [string]: UserType
  }
};

const mockUser: UserType = {
  id: 'xxxxxxxx',
  displayName: 'ユーザー名',
  worksNum: 56
};

const initialState: State = {
  byUserId: {
    [mockUser.id]: mockUser
  }
};

// Root Reducer
export default (state: State = initialState, action: ActionType): State => {
  switch (action.type) {
    case LOAD:
      return {
        ...state
      };
    case CREATE:
      return {
        ...state
      };
    case UPDATE:
      return {
        ...state
      };
    case REMOVE:
      return {
        ...state
      };
    default:
      return state;
  }
};

// Action Creators

export const loadUsers = () => ({
  type: LOAD
});

export const createUser = (user: UserType) => ({
  type: CREATE,
  user
});

export const updateUser = (user: UserType) => ({
  type: UPDATE,
  user
});

export const removeUser = (user: UserType) => ({
  type: REMOVE,
  user
});
