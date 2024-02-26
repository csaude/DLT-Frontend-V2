import { createSlice } from "@reduxjs/toolkit";

export interface InterventionCount {
  beneficiary_offline_id: number;
  total: number;
}

export interface BeneficiaryInterventionSlice {
  totals: InterventionCount[];
}

const initialState: BeneficiaryInterventionSlice = {
  totals: [],
};

export const authSlice = createSlice({
  name: "beneficiaryIntervention",
  initialState,
  reducers: {
    loadBeneficiariesInterventionsCounts: (state, { payload }) => {
      state.totals = payload;
    },
  },
});

export const { loadBeneficiariesInterventionsCounts } = authSlice.actions;

export default authSlice.reducer;
