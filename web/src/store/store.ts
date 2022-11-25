import {configureStore} from '@reduxjs/toolkit';

import {authSlice} from '@app/store/reducers/auth';
import {uiSlice} from '@app/store/reducers/ui';
import {createLogger} from 'redux-logger';
import referenceReducer from './reducers/reference';
import beneficiaryReducer from './reducers/beneficiary';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    beneficiary: beneficiaryReducer,
    reference: referenceReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware().concat(createLogger())
  ]
});

export default store;
