import { Effect } from 'dva';
import { Reducer } from 'redux';
import { add, edit, query } from '../services/users';

export interface Loading {
    effects: { [key: string]: boolean | undefined };
    models: {
      global?: boolean;
      menu?: boolean;
      user?: boolean;
      login?: boolean;
    };
}


export interface Users {
  id?: string,
	surname?: string,
	name?: string,
	phoneNumber?: string,
	email?: string,
	username?: string,
	password?: string,
	entryPoint?: any,
	status?: any,
	createdBy?: string,
	dateCreated?: string,
	updatedBy?: string,
	dateUpdated?: string,
  locality?: any,
  partners?: any,
  profiles?: any,
  us?: any
}

export interface UsersModelState{
  loading?: Loading,
  users: Users[]
}

export interface UsersModelType {
    namespace: string;
    state: UsersModelState;
    effects: {
      fetch: Effect;
      create: Effect;
      update: Effect;
    };
    reducers: {
      save: Reducer<UsersModelState>;
      addUser: Reducer<UsersModelState>;
      updateUser: Reducer<UsersModelState>;
    };
}

const UsersModel: UsersModelType = {
    namespace: 'users',

    state: {
      loading: {
        effects: {
          'users/create':true
        },
        models:{}
      },
      users: []
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(query, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },

        *create({ payload, callback }, { call, put }) {
            const response = yield call(add, payload);
            const { status, data } = response;

            /**
             * TODO
             * add error response validation 
             */
            /*
            yield put({
                type: 'addUser',
                payload: data,
            });
              */
          },

        *update({ payload, callback }, { call, put }) {
            const response = yield call(edit, payload);

            /**
             * TODO
             * add error response validation 
             */
            yield put({
                type: 'updateUser',
                payload: response,
            });
        },
    },

    reducers: {
        save(state, { payload }) {
            return {
              ...state,
              users: payload
            };
        },

        addUser(state, { payload }) {
            return {
              ...state,
              users: [payload, ...(state as UsersModelState).users],
            };
        },

        updateUser(state, { payload }) {
            return {
              ...state,
              users: (state as UsersModelState).users.map((item, index) => {
                if (item.id === payload.id) {
                  return {
                    ...payload,
                  };
                }
                return item;
              }),
            };
        },
    }
}

export default UsersModel;

