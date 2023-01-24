import {combineReducers, configureStore} from '@reduxjs/toolkit';

import auth from './authSlice'

const rootReducer = combineReducers({
  auth : auth
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
