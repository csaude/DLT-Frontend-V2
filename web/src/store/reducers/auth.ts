import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user?: any;
  currentUser: any;
}

const initialState: AuthState = {
  isLoggedIn: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: {
    provinces : []
  },
  currentUser: {
    email: 'mail@example.com',
    picture: null,
    name: null,
    surname: null,
    dateCreated: null
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, {payload}) => {
      localStorage.setItem('token', payload?.token);
      console.log(payload);
      state.user = payload?.account;
      state.user.provinces = payload?.account.provinces;
      state.isLoggedIn = true;
      state.token = payload?.token;
      localStorage.setItem('name', payload?.account.name);
      localStorage.setItem('surname', payload?.account.surname);
    },
    logoutUser: (state) => {
      localStorage.clear();
      state.currentUser = {};
      state.isLoggedIn = false;
      state.token = null;
    },
    loadUser: (state, {payload}) => {
      state.currentUser = payload;
    }
  }
});

export const {loginUser, logoutUser, loadUser} = authSlice.actions;

export default authSlice.reducer;
