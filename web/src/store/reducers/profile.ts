import { GET_PROFILES } from "../actions/types";

const initialState = {
  loadedProfiles: [],
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILES: {
      const loadedProfiles: any = [];
      for (const [profileId, name, description] of payload) {
        loadedProfiles.push({
          id: profileId,
          name: name,
          description: description,
        });
      }
      return {
        ...state,
        loadedProfiles: loadedProfiles,
      };
    }
    default:
      return state;
  }
}

export default profileReducer;
