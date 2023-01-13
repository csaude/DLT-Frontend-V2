import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userDetailsSlice from './userDetailsSlice';
import userListSlice from './userListSlice';

const rootReducer = combineReducers({
  userList: userListSlice,
  userDetails : userDetailsSlice
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
