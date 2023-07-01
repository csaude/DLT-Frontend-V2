import { createSlice } from "@reduxjs/toolkit";

export interface ReportState {
  agyw?: any;
  ids?: number[];
  allIds: number[];
  title: string;
  total: number;
}

const initialState: ReportState = {
  agyw: "",
  ids: [],
  allIds: [],
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
    loadAllBeneficiariesIds: (state, { payload }) => {
      payload.ids?.forEach((id) => {
        if (!state.allIds.includes(id)) {
          state.allIds.push(id);
        }
      });
    },
  },
});

export const { loadAgywData, loadBeneficiariesIds, loadAllBeneficiariesIds } =
  reportSlice.actions;

export default reportSlice.reducer;
