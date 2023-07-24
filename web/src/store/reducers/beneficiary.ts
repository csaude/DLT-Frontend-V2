import { GET_BENEFICIARIES_TOTAL } from "../actions/types";

const initialState = {
  total: undefined,
};

function beneficiaryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BENEFICIARIES_TOTAL:
      return {
        ...state,
        total: payload,
      };
    default:
      return state;
  }
}

export default beneficiaryReducer;
