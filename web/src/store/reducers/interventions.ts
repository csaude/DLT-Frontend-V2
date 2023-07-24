import { GET_INTERVENTIONS_COUNT } from "../actions/types";

const initialState = {
  interventions: [],
};

function interventionReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_INTERVENTIONS_COUNT:
      return {
        ...state,
        interventions: payload,
      };
    default:
      return state;
  }
}

export default interventionReducer;
