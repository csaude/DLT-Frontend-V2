import { GET_PARTNERS } from "../actions/types";

const initialState = {
  loadedPartners: [],
};

function partnerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PARTNERS: {
      const loadedPartners: any = [];
      for (const [partnerId, name] of payload) {
        loadedPartners.push({
          id: partnerId,
          name: name,
        });
      }
      return {
        ...state,
        loadedPartners: loadedPartners,
      };
    }
    default:
      return state;
  }
}

export default partnerReducer;
