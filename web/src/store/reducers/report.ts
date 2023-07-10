import { createSlice } from "@reduxjs/toolkit";

export interface ReportState {
  agyw?: any;
  ids?: number[];
  totalIds: number[];
  title: string;
  total: number;
  serviceAgebands: [];
}

const initialState: ReportState = {
  agyw: "",
  ids: [],
  totalIds: [],
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
    loadTotalBeneficiariesIds: (state, { payload }) => {
      payload.ids?.forEach((id) => {
        if (!state.totalIds.includes(id)) {
          state.totalIds.push(id);
        }
      });
      state.ids = state.totalIds;
      state.title = payload.title;
      state.total = payload.total;
    },
    loadServiceAgebands: (state, { payload }) => {
      state.serviceAgebands = payload;
    },
    resetTotalBeneficiariesIds: (state) => {
      state.totalIds = [];
    },
  },
});

export const {
  loadAgywData,
  loadBeneficiariesIds,
  loadTotalBeneficiariesIds,
  loadServiceAgebands,
  resetTotalBeneficiariesIds,
} = reportSlice.actions;

export default reportSlice.reducer;
