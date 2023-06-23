import {combineReducers, configureStore} from '@reduxjs/toolkit';

import authSlice from './authSlice'
import beneficiarySlice from './beneficiarySlice';
import referenceSlice from './referenceSlice';
import beneficiaryInterventionSlice from './beneficiaryInterventionSlice';

const rootReducer = combineReducers({
  auth : authSlice,
  beneficiary: beneficiarySlice,
  reference: referenceSlice,
  beneficiaryIntervention: beneficiaryInterventionSlice
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
