import {
    GET_NAMES,
  } from '../actions/types';
  
  const initialState = {
    interventions: [],
  };
  
  function userReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_NAMES:
        return {
          ...state,
          users: payload
        }; 
      default:
        return state;
    }
  }
  
  export default userReducer;