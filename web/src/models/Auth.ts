import { Effect } from 'dva';
import { Reducer } from 'redux';
import { NavigationActions } from 'react-navigation';
import { setAuthorization, cleanStorage } from '../services/authorization';
import { authenticate } from '../services/login';
import { Users } from './Users';
import { navigate } from '../routes/RootNavigation';

export interface Loading {
    effects: { [key: string]: boolean | undefined };
    models: {
      global?: boolean;
      menu?: boolean;
      user?: boolean;
      login?: boolean;
    };
}

export interface AuthModelState{
    loggedUser: Users,
    logged: boolean,
}

export interface AuthModelType {
    namespace: string;
    state: AuthModelState;
    effects: {
      login: Effect;
      logout: Effect;
      //change password ...
    };
    reducers: {
        changeLoginStatus: Reducer<AuthModelState>;
    };
}

const AuthModel: AuthModelType = {
    namespace: 'auth',
    state: {
        loggedUser: {},
        logged: false
    },
    
    effects: {
        *login({ payload }, { call, put }) {
            const response = yield call(authenticate, payload);
            
            yield put({
                type: 'changeLoginStatus',
                payload: response,
            });
            const { status, data } = response;

            /* update localstorage */
            if(status === 200){

                setAuthorization(data.token);

                navigate({name: "Main", params: {}});
            }
            
        },

        *logout(_, { put }) {
            cleanStorage();
            yield put(NavigationActions.navigate({ routeName: 'Login' }));
        }
    },
    reducers: {
        changeLoginStatus(state, { payload }) {

            return {
              ...state,
              logged: payload.status === 200 ? true : false,
              loggedUser: payload.data.account,
            };
          },
    }

}

export default AuthModel;
