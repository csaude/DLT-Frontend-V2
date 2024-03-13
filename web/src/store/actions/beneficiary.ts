import {
  GET_BENEFICIARIES_TOTAL,
  LOAD_BENEFICIARY,
  LOAD_VALIDATED_BENEFICIARY_ID,
} from "./types";

export const getBeneficiariesTotal = (total) => async (dispatch) => {
  dispatch({
    type: GET_BENEFICIARIES_TOTAL,
    payload: total,
  });
};

export const loadValidatedBeneficiaryNui =
  (validatedBeneficiaryNui) => async (dispatch) => {
    dispatch({
      type: LOAD_VALIDATED_BENEFICIARY_ID,
      payload: validatedBeneficiaryNui,
    });
  };

export const loadBeneficiary = (beneficiary) => async (dispatch) => {
  dispatch({
    type: LOAD_BENEFICIARY,
    payload: beneficiary,
  });
};
