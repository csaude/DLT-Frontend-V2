import { GET_REFERENCES_TOTAL } from "./types";

export const getReferencesTotal = (total) => async (dispatch) => {
    dispatch({
      type: GET_REFERENCES_TOTAL,
      payload: total,
    })
};