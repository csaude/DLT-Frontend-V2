import { GET_PROVINCES } from "../actions/types";

const initialState = {
  loadedProvinces: [],
};

function provinceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROVINCES: {
      const loadedProvinces: any = [];
      for (const [provinceId, name, code] of payload) {
        loadedProvinces.push({
          id: provinceId,
          name: name,
          code: code,
        });
      }
      return {
        ...state,
        loadedProvinces: loadedProvinces,
      };
    }
    default:
      return state;
  }
}

export default provinceReducer;
