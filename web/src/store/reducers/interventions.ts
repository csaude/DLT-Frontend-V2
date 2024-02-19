import { GET_INTERVENTIONS_COUNT } from "../actions/types";

const initialState = {
  interventions: [],
  loadedInterventions: [],
};

function interventionReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_INTERVENTIONS_COUNT: {
      const loadedInterventions: any = [];
      for (const [
        beneficiaryId,
        total,
        clinicalTotal,
        communityTotal,
      ] of payload) {
        loadedInterventions.push({
          beneficiaryId: beneficiaryId,
          total: total,
          clinicalTotal: clinicalTotal,
          communityTotal: communityTotal,
        });
      }
      return {
        ...state,
        interventions: payload,
        loadedInterventions: loadedInterventions,
      };
    }
    default:
      return state;
  }
}

export default interventionReducer;
