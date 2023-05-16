import { createSlice } from "@reduxjs/toolkit";

export interface beneficiarySlice {
  total: number;
}

const initialState: beneficiarySlice = {
  total: 0,
};

export const authSlice = createSlice({
  name: "beneficiary",
  initialState,
  reducers: {
    getBeneficiariesTotal: (state, { payload }) => {
      state.total = payload;
    },
  },
});

export const { getBeneficiariesTotal } = authSlice.actions;

export default authSlice.reducer;
