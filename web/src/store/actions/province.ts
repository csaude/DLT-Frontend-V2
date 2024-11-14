import { GET_PROVINCES } from "./types";
import { getProvincesQuery } from "@app/utils/province";

export const getProvinces = () => async (dispatch) => {
  const provinces = await getProvincesQuery();
  dispatch({
    type: GET_PROVINCES,
    payload: provinces,
  });
};
