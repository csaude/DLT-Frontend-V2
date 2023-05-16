import { createSlice } from "@reduxjs/toolkit";

export interface referenceSlice {
  total: number;
}

const initialState: referenceSlice = {
  total: 0,
};

export const authSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {
    getReferencesTotal: (state, { payload }) => {
      state.total = payload;
    },
  },
});

export const { getReferencesTotal } = authSlice.actions;

export default authSlice.reducer;
