import { GET_DISTRICTS } from "../actions/types";

const initialState = {
  loadedDistricts: [],
};

function districtReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DISTRICTS: {
      const loadedDistricts: any = [];
      for (const [districtId, name, code] of payload) {
        loadedDistricts.push({
          id: districtId,
          name: name,
          code: code,
        });
      }
      return {
        ...state,
        loadedDistricts: loadedDistricts,
      };
    }
    default:
      return state;
  }
}

export default districtReducer;
