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
    }
  }
});

export const {updateNextServiceIndex} = referenceInterventionSlice.actions;

export default referenceInterventionSlice.reducer;
