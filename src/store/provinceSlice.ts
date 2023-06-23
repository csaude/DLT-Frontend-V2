import { createSlice } from "@reduxjs/toolkit";

export interface provinceSlice {
  provinces: any[];
}

const initialState: provinceSlice = {
  provinces: [],
};

export const provinceSlice = createSlice({
  name: "province",
  initialState,
  reducers: {
    loadProvinces: (state, { payload }) => {
      state.provinces = payload;
    },
  },
});

export const { loadProvinces } = provinceSlice.actions;

export default provinceSlice.reducer;
