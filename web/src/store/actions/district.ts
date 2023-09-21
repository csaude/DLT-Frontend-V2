import { GET_DISTRICTS } from "./types";
import { getDistrictsQuery } from "@app/utils/district";

export const getDistricts = () => async (dispatch) => {
  const provinces = await getDistrictsQuery();
  // console.log("---provs----", provinces);
  dispatch({
    type: GET_DISTRICTS,
    payload: provinces,
  });
};
