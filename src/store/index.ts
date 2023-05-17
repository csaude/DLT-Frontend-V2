import {combineReducers, configureStore} from '@reduxjs/toolkit';

import authSlice from './authSlice'
import beneficiarySlice from './beneficiarySlice';
import referenceSlice from './referenceSlice';

const rootReducer = combineReducers({
  auth : authSlice,
  beneficiary: beneficiarySlice,
  reference: referenceSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
