import {createSlice} from '@reduxjs/toolkit';

export interface ReferenceInterventionState {
  nextServiceIndex?: any;
}

const initialState: ReferenceInterventionState = {
  nextServiceIndex: '',
};

export const referenceInterventionSlice = createSlice({
  name: 'referenceIntervention',
  initialState,
  reducers: {
    updateNextServiceIndex: (state, {payload}) => {
      state.nextServiceIndex = payload;
    }
  }
});

export const {updateNextServiceIndex} = referenceInterventionSlice.actions;

export default referenceInterventionSlice.reducer;
