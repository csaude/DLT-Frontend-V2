import { GET_USERNAMES, LOAD_REFERERS } from "../actions/types";

const initialState = {
  users: [],
  referers: [],
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USERNAMES:
      return {
        ...state,
        users: payload,
      };
    case LOAD_REFERERS:
      return {
        ...state,
        referers: payload,
      };
    default:
      return state;
  }
}

export default userReducer;
