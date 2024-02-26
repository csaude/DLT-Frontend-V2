import { createSlice } from "@reduxjs/toolkit";

export interface syncSlice {
  pendingSyncBeneficiaries: number;
  pendingSyncBeneficiariesInterventions: number;
  pendingSyncReferences: number;
}

const initialState: syncSlice = {
  pendingSyncBeneficiaries: 0,
  pendingSyncBeneficiariesInterventions: 0,
  pendingSyncReferences: 0,
};

export const authSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    loadPendingsBeneficiariesTotals: (state, { payload }) => {
      state.pendingSyncBeneficiaries = payload.pendingSyncBeneficiaries;
    },
    loadPendingsBeneficiariesInterventionsTotals: (state, { payload }) => {
      state.pendingSyncBeneficiariesInterventions =
        payload.pendingSyncBeneficiariesInterventions;
    },
    loadPendingsReferencesTotals: (state, { payload }) => {
      state.pendingSyncReferences = payload.pendingSyncReferences;
    },
  },
});

export const {
  loadPendingsBeneficiariesTotals,
  loadPendingsBeneficiariesInterventionsTotals,
  loadPendingsReferencesTotals,
} = authSlice.actions;

export default authSlice.reducer;
