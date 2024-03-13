import {
  GET_BENEFICIARIES_TOTAL,
  LOAD_BENEFICIARY,
  LOAD_VALIDATED_BENEFICIARY_ID,
} from "../actions/types";

const initialState = {
  total: undefined,
  validatedBeneficiaryNui: undefined,
  beneficiary: undefined,
};

function beneficiaryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BENEFICIARIES_TOTAL:
      return {
        ...state,
        total: payload,
      };
    case LOAD_VALIDATED_BENEFICIARY_ID:
      return {
        ...state,
        validatedBeneficiaryNui: payload,
      };
    case LOAD_BENEFICIARY:
      return {
        ...state,
        beneficiary: payload,
      };
    default:
      return state;
  }
}

export default beneficiaryReducer;
