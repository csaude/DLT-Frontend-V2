import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import * as apiClient from './apiClient';


const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: ()=>'Logged User',
  reducers: {},
});

export default userDetailsSlice.reducer;
