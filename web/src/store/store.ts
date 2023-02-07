import {configureStore} from '@reduxjs/toolkit';

import {authSlice} from '@app/store/reducers/auth';
import {uiSlice} from '@app/store/reducers/ui';
import {createLogger} from 'redux-logger';
import referenceReducer from './reducers/reference';
import beneficiaryReducer from './reducers/beneficiary';
import interventionReducer from './reducers/interventions';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    beneficiary: beneficiaryReducer,
    reference: referenceReducer,
    intervention: interventionReducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware().concat(createLogger())
  ]
});

export default store;
