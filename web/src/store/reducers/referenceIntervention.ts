import {createSlice} from '@reduxjs/toolkit';

export interface ReferenceInterventionState {
  index?: any;
}

const initialState: ReferenceInterventionState = {
  index: 0,
};

export const referenceInterventionSlice = createSlice({
  name: 'referenceIntervention',
  initialState,
  reducers: {
    updateNextServiceIndex: (state) => {
      state.index = state.index+1;
    },
    resetNextServiceIndex: (state) => {
      state.index = 0;
    }
  }
});

export const {updateNextServiceIndex, resetNextServiceIndex} = referenceInterventionSlice.actions;

export default referenceInterventionSlice.reducer;
