import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userDetailsSlice from './userDetailsSlice';
import userListSlice from './userListSlice';
import auth from './auth'

const rootReducer = combineReducers({
  userList: userListSlice,
  userDetails : userDetailsSlice,
  auth : auth
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
