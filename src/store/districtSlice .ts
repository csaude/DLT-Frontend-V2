import { createSlice } from "@reduxjs/toolkit";

export interface districtSlice {
  districts: any[];
}

const initialState: districtSlice = {
  districts: [],
};

export const authSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    loadDistricts: (state, { payload }) => {
      state.districts = payload;
    },
  },
});

export const { loadDistricts } = authSlice.actions;

export default authSlice.reducer;
