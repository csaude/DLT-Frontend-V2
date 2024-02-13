import { GET_INTERVENTIONS_COUNT } from "./types";
import { getInterventionCountAllInterventionsAndbByServiceTypeQuery } from "@app/utils/beneficiaryIntervention";

export const getInterventionsCount = () => async (dispatch) => {
  const interventionsCount =
    await getInterventionCountAllInterventionsAndbByServiceTypeQuery();
  dispatch({
    type: GET_INTERVENTIONS_COUNT,
    payload: interventionsCount,
  });
};
