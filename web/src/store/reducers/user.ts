import { GET_USERNAMES, LOAD_REFERERS } from "../actions/types";

const initialState = {
  users: [],
  loadedUsers: [],
  referers: [],
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USERNAMES: {
      const loadedUsers: any = [];
      for (const [userId, username] of payload) {
        loadedUsers.push({
          id: userId,
          username: username,
        });
      }
      return {
        ...state,
        users: payload,
        loadedUsers: loadedUsers,
      };
    }
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
