import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isLoggedIn: boolean;
  token: any;
  user?: any;
  currentUser: any;
  userDetails: any;
}

const initialState: AuthState = {
  currentUser: {
    email: "",
    picture: "",
    name: "",
    surname: "",
    dateCreated: "",
  },
  isLoggedIn: false,
  token: "",
  userDetails: {
    user_id: "",
    provinces: [],
    districts: [],
    localities: [],
    uss: [],
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, { payload }) => {
      console.log(payload);
      state.user = payload?.account;
      state.isLoggedIn = true;
      state.token = payload?.token;
    },
    logoutUser: (state) => {
      state.currentUser = {};
      state.isLoggedIn = false;
      state.token = "";
      state.userDetails = {};
    },
    loadUser: (state, { payload }) => {
      state.currentUser = payload;
      state.isLoggedIn = true;
      state.userDetails = {
        user_id:
          payload.online_id !== undefined ? payload.online_id : payload.id,
        provinces: payload.provinces !== undefined ? payload.provinces : "",
        districts: payload.districts !== undefined ? payload.districts : "",
        localities: payload.localities !== undefined ? payload.localities : "",
        uss: payload.us !== undefined ? payload.us : "",
      };
    },
    loadUserProvinces: (state, { payload }) => {
      const provinces: any = [];
      payload.provinces.map((item) => {
        const province = {
          id: item.online_id,
          name: item.name,
        };
        provinces.push(province);
      });
      state.userDetails.provinces = provinces;
    },
    loadUserDistricts: (state, { payload }) => {
      const districts: any = [];
      payload.districts.map((item) => {
        const district = {
          id: item.online_id,
          name: item.name,
        };
        districts.push(district);
      });
      state.userDetails.districts = districts;
    },
    loadUserLocalities: (state, { payload }) => {
      const localities: any = [];
      payload.localities.map((item) => {
        const locality = {
          id: item.online_id,
          name: item.name,
        };
        localities.push(locality);
      });
      state.userDetails.localities = localities;
    },
    loadUserUss: (state, { payload }) => {
      const uss: any = [];
      payload.uss.map((item) => {
        const us = {
          id: item.online_id,
          name: item.name,
        };
        uss.push(us);
      });
      state.userDetails.uss = uss;
    },
  },
});

export const {
  logoutUser,
  loadUser,
  loadUserProvinces,
  loadUserDistricts,
  loadUserLocalities,
  loadUserUss,
} = authSlice.actions;

export default authSlice.reducer;
