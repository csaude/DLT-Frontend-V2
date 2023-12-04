import {
  GET_USERNAMES,
  GET_USERS_LAST_SYNC,
  LOAD_REFERERS,
} from "../actions/types";

const initialState = {
  users: [],
  loadedUsers: [],
  referers: [],
  usersLastSync: [],
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
    case GET_USERS_LAST_SYNC:
      return {
        ...state,
        usersLastSync: payload,
      };
    default:
      return state;
  }
}

export default userReducer;
