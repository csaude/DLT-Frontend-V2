import { createSlice } from "@reduxjs/toolkit";

export interface ReportState {
  agyw?: any;
  ids?: number[];
  allIds: number[];
  title: string;
  total: number;
  serviceAgebands: [];
}

const initialState: ReportState = {
  agyw: "",
  ids: [],
  allIds: [],
  title: "",
  total: 0,
  serviceAgebands: [],
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
    loadServiceAgebands: (state, { payload }) => {
      state.serviceAgebands = payload;
    },
  },
});

export const {
  loadAgywData,
  loadBeneficiariesIds,
  loadAllBeneficiariesIds,
  loadServiceAgebands,
} = reportSlice.actions;

export default reportSlice.reducer;
