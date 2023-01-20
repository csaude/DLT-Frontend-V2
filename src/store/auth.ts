import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthState {
  isLoggedIn: boolean;
  token: any;
  user?: any;
  currentUser: any;
}

const initialState: AuthState = {
  isLoggedIn: !!AsyncStorage.getItem('token'),
  token: AsyncStorage.getItem('token'),
  currentUser: {
    email: '',
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
      AsyncStorage.setItem('token', payload?.token);
      console.log(payload);
      state.user = payload?.account;
      state.isLoggedIn = true;
      state.token = payload?.token;
      AsyncStorage.setItem('name', payload?.account.name);
      AsyncStorage.setItem('surname', payload?.account.surname);
    },
    logoutUser: (state) => {
      AsyncStorage.removeItem('token');
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
