import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query } from '../services/locality';

export interface Loading {
    effects: { [key: string]: boolean | undefined };
    models: {
        global?: boolean;
        menu?: boolean;
        user?: boolean;
        login?: boolean;
    }
}

export interface Locality {
    id: string,
    district?: any,
    name: string,
    description?: string,
    status?: boolean,
    createdBy?: string,
    updatedBy?: string,
}

export interface LocalityModelState {
    loading?: Loading,
    localities: Locality[]
}

export interface LocalityModelType {
    namespace: string;
    state: LocalityModelState;
    effects: {
        fetch: Effect;
    };
    reducers: {
        save: Reducer<LocalityModelState>;
    }
}

const LocalityModel: LocalityModelType = {
    namespace: 'localities',
    
    state: {
        loading: {
            effects: {

            },
            models:{}
        },
        localities: []
    },

    effects: {
        *fetch({ payload }, { call, put }){
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
              localities: payload
            };
        },
    }
}

export default LocalityModel;