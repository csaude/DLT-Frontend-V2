import { GET_BENEFICIARIES_TOTAL } from "./types";

export const getBeneficiariesTotal = (total) => async (dispatch) => {
    dispatch({
      type: GET_BENEFICIARIES_TOTAL,
      payload: total,
    })
};