import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query } from '../services/profiles';


export interface Profiles {
    id: string,
    name: string,
    description?: string
}

export interface ProfilesModelState{
    profiles: Profiles[]
}

export interface ProfilesModelType {
    namespace: string;
    state: ProfilesModelState;
    effects: {
      fetch: Effect;
    };
    reducers: {
      save: Reducer<ProfilesModelState>;
    };
}

const ProfilesModel: ProfilesModelType = {
    namespace: 'profiles',
    state : {
        profiles: []
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
              profiles: payload
            };
        },
    }
}
export default ProfilesModel;


