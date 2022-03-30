import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query } from '../services/us';

export interface Us {
    id: string,
    usType?: any,
    code?: string,
    name: string,
    abbreviation?: string,
    description?: string,
    latitude?: string,
    longitude?: string,
    localityId?: string,
    logo?: string,
    status?: string,
    createdBy?: string,
    updatedBy?: string
}

export interface UsModelState{
    us: Us[]
}

export interface UsModelType {
    namespace: string;
    state: UsModelState;
    effects: {
      fetch: Effect;
    };
    reducers: {
      save: Reducer<UsModelState>;
    };
}

const UsModel: UsModelType = {
    namespace: 'us',
    state : {
        us: []
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(query, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
    },
    reducers: {
        save(state, { payload }) {
            return {
              ...state,
              us: payload
            };
        },
    }
}
export default UsModel;


