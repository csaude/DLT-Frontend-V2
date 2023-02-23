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
    user_id: '',
    provinces : [],
    districts : [],
    localities : [],
    uss : []
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
      state.userDetails = {
          user_id : payload.id !==undefined ? payload.id : payload.online_id,
          provinces : payload.provinces !==undefined ?  payload.provinces : '',
          districts : payload.districts !==undefined ? payload.districts : '', 
          localities : payload.localities !==undefined ? payload.localities : '', 
          uss : payload.us !==undefined ? payload.us : ''
      }
    },
    loadUserProvinces:(state, {payload}) => {
        state.userDetails.provinces =  payload.provinces 
    },
    loadUserDistricts:(state, {payload})=>{
        state.userDetails.districts = payload.districts 
    },
    loadUserLocalities:(state, {payload})=>{
        state.userDetails.localities = payload.localities
    },
    loadUserUss:(state, {payload})=>{
        state.userDetails.uss = payload.uss
    }
  }
});

export const { logoutUser, loadUser, loadUserProvinces, loadUserDistricts, loadUserLocalities, loadUserUss} = authSlice.actions;

export default authSlice.reducer;
