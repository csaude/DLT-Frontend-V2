import { createSlice } from "@reduxjs/toolkit";

export interface ReferenceInterventionState {
  index?: any;
  remarks?: any;
}

const initialState: ReferenceInterventionState = {
  index: 0,
  remarks: "",
};

export const referenceInterventionSlice = createSlice({
  name: "referenceIntervention",
  initialState,
  reducers: {
    updateNextServiceIndex: (state) => {
      state.index = state.index + 1;
    },
    resetNextServiceIndex: (state) => {
      state.index = 0;
    },
    loadRemarks: (state, { payload }) => {
      state.remarks = payload;
    },
  },
});

export const { updateNextServiceIndex, resetNextServiceIndex, loadRemarks } =
  referenceInterventionSlice.actions;

export default referenceInterventionSlice.reducer;
