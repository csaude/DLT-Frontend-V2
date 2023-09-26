import { GET_PARTNERS } from "./types";
import { getPartnersQuery } from "@app/utils/partners";

export const getPartners = () => async (dispatch) => {
  const partners = await getPartnersQuery();

  dispatch({
    type: GET_PARTNERS,
    payload: partners,
  });
};
