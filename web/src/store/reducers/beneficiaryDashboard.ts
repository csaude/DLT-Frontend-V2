import { createSlice } from "@reduxjs/toolkit";

export interface BeneficiaryDashboardState {
  totalOfClinicalInterventions: any;
  totalOfCommunityInterventions: any;
  totalOfPrimaryInterventions: any;
  totalOfSecondaryInterventions: any;
  totalOfContextualInterventions: any;
  totalReferences: any;
}

const initialState: BeneficiaryDashboardState = {
  totalOfClinicalInterventions: undefined,
  totalOfCommunityInterventions: undefined,
  totalOfPrimaryInterventions: undefined,
  totalOfSecondaryInterventions: undefined,
  totalOfContextualInterventions: undefined,
  totalReferences: undefined,
};

export const beneficiaryDashboardSlice = createSlice({
  name: "beneficiaryDashboard",
  initialState,
  reducers: {
    loadGeneralIndicators: (state, { payload }) => {
      state.totalOfClinicalInterventions = payload.totalOfClinicalInterventions;
      state.totalOfCommunityInterventions =
        payload.totalOfCommunityInterventions;
      state.totalOfPrimaryInterventions = payload.totalOfPrimaryInterventions;
      state.totalOfSecondaryInterventions =
        payload.totalOfSecondaryInterventions;
      state.totalOfContextualInterventions =
        payload.totalOfContextualInterventions;
      state.totalReferences = payload.totalReferences;
    },
  },
});

export const { loadGeneralIndicators } = beneficiaryDashboardSlice.actions;

export default beneficiaryDashboardSlice.reducer;
