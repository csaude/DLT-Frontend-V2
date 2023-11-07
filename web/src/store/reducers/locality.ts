import { GET_LOCALITIES } from "../actions/types";

const initialState = {
  loadedLocalities: [],
};

function localityReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LOCALITIES: {
      const loadedLocalities: any = [];
      for (const [localityId, name] of payload) {
        loadedLocalities.push({
          id: localityId,
          name: name,
        });
      }
      return {
        ...state,
        loadedLocalities: loadedLocalities,
      };
    }
    default:
      return state;
  }
}

export default localityReducer;
