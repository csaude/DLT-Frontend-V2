import { GET_REFERENCES_TOTAL } from "../actions/types";

const initialState = {
  total: undefined,
};

function referenceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_REFERENCES_TOTAL:
      return {
        ...state,
        total: payload,
      };
    default:
      return state;
  }
}

export default referenceReducer;
