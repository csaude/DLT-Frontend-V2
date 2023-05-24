import { createSlice } from "@reduxjs/toolkit";

export interface EventState {
  event: any;
  active: boolean;
}

const initialState: EventState = {
  event: null,
  active: true,
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    handleUserInteraction: (state, { payload }) => {
      state.event = payload;
    },
    handleActiveEvents: (state, { payload }) => {
      state.active = payload;
    },
  },
});

export const { handleUserInteraction, handleActiveEvents } =
  eventSlice.actions;

export default eventSlice.reducer;
