import { createSlice } from "@reduxjs/toolkit";

export interface localitySlice {
  localities: any[];
}

const initialState: localitySlice = {
  localities: [],
};

export const authSlice = createSlice({
  name: "locality",
  initialState,
  reducers: {
    loadLocalities: (state, { payload }) => {
      state.localities = payload;
    },
  },
});

export const { loadLocalities } = authSlice.actions;

export default authSlice.reducer;
