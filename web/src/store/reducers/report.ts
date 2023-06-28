import { createSlice } from "@reduxjs/toolkit";

export interface ReportState {
  agyw?: any;
  ids?: number[];
  title: string;
  total: number;
}

const initialState: ReportState = {
  agyw: "",
  ids: [],
  title: "",
  total: 0,
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    loadAgywData: (state, { payload }) => {
      state.agyw = payload;
    },
    loadBeneficiariesIds: (state, { payload }) => {
      state.ids = payload.ids;
      state.title = payload.title;
      state.total = payload.total;
    },
  },
});

export const { loadAgywData, loadBeneficiariesIds } = reportSlice.actions;

export default reportSlice.reducer;
