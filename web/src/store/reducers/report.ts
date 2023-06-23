import { createSlice } from "@reduxjs/toolkit";

export interface ReportState {
  agyw?: any;
}

const initialState: ReportState = {
  agyw: "",
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    loadAgywData: (state, { payload }) => {
      state.agyw = payload;
    },
  },
});

export const { loadAgywData } = reportSlice.actions;

export default reportSlice.reducer;
