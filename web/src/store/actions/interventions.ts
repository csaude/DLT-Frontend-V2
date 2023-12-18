import { GET_INTERVENTIONS_COUNT } from "./types";
import { interventionCountByServiceTypeQuery } from "@app/utils/beneficiaryIntervention";

export const getInterventionsCount = () => async (dispatch) => {
  const interventionsCount = await interventionCountByServiceTypeQuery();
  dispatch({
    type: GET_INTERVENTIONS_COUNT,
    payload: interventionsCount,
  });
};
