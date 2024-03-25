import { createSlice } from "@reduxjs/toolkit";

export interface syncSlice {
  pendingSyncBeneficiaries: number;
  pendingSyncBeneficiariesInterventions: number;
  pendingSyncReferences: number;
  syncInProgress: boolean;
}

const initialState: syncSlice = {
  pendingSyncBeneficiaries: 0,
  pendingSyncBeneficiariesInterventions: 0,
  pendingSyncReferences: 0,
  syncInProgress: false,
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
    updateSyncInProgress: (state, { payload }) => {
      state.syncInProgress = payload;
    },
  },
});

export const {
  loadPendingsBeneficiariesTotals,
  loadPendingsBeneficiariesInterventionsTotals,
  loadPendingsReferencesTotals,
  updateSyncInProgress,
} = authSlice.actions;

export default authSlice.reducer;
