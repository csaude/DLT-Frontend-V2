import { createSlice } from "@reduxjs/toolkit";

export interface beneficiarySlice {
  total: number;
  viewedBeneficiaryGender: string;
}

const initialState: beneficiarySlice = {
  total: 0,
  viewedBeneficiaryGender: "",
};

export const authSlice = createSlice({
  name: "beneficiary",
  initialState,
  reducers: {
    getBeneficiariesTotal: (state, { payload }) => {
      state.total = payload;
    },
    loadViewedBeneficiaryGender: (State, { payload }) => {
      State.viewedBeneficiaryGender = payload;
    },
  },
});

export const { getBeneficiariesTotal, loadViewedBeneficiaryGender } =
  authSlice.actions;

export default authSlice.reducer;
