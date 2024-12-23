import { GET_DISTRICTS } from "./types";
import { getDistrictsQuery } from "@app/utils/district";

export const getDistricts = () => async (dispatch) => {
  const provinces = await getDistrictsQuery();
  dispatch({
    type: GET_DISTRICTS,
    payload: provinces,
  });
};
