import { GET_INTERVENTIONS_COUNT } from "./types";
import { interventionCountQuery } from "@app/utils/beneficiaryIntervention";

export const getInterventionsCount = () => async (dispatch) => {
  const interventionsCount = await interventionCountQuery();

  dispatch({
    type: GET_INTERVENTIONS_COUNT,
    payload: interventionsCount,
  });
};
