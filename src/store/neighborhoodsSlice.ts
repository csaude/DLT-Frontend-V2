import { createSlice } from "@reduxjs/toolkit";

export interface neighborhoodSlice {
  neighborhoods: any[];
}

const initialState: neighborhoodSlice = {
  neighborhoods: [],
};

export const authSlice = createSlice({
  name: "neighborhood",
  initialState,
  reducers: {
    loadNeighborhoods: (state, { payload }) => {
      state.neighborhoods = payload;
    },
  },
});

export const { loadNeighborhoods } = authSlice.actions;

export default authSlice.reducer;
