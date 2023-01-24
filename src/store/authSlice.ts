import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
  token: any;
  user?: any;
  currentUser: any;
  userDetails: any;
}

const initialState: AuthState = {
  currentUser: {
    email: '',
    picture: '',
    name: '',
    surname: '',
    dateCreated: ''
  },
  isLoggedIn: false,
  token: '',
  userDetails: { 
    user_id: ''
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, {payload}) => {
      console.log(payload);
      state.user = payload?.account;
      state.isLoggedIn = true;
      state.token = payload?.token;
    },
    logoutUser: (state) => {
      state.currentUser = {};
      state.isLoggedIn = false;
      state.token = '';
      state.userDetails = {}
    },
    loadUser: (state, {payload}) => {
      state.currentUser = payload;
      state.isLoggedIn = true;
    },
    loadUserDetails: (state, {payload}) => {
        state.userDetails = {
          user_id : payload.online_id !==undefined ? payload.online_id : payload.id
        }
    }
  }
});

export const { logoutUser, loadUser, loadUserDetails} = authSlice.actions;

export default authSlice.reducer;
