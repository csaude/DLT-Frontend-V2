import { getLocalitiesQuery } from "@app/utils/locality";
import { GET_LOCALITIES } from "./types";

export const getLocalities = () => async (dispatch) => {
  const localities = await getLocalitiesQuery();
  // console.log("---provs----", provinces);
  dispatch({
    type: GET_LOCALITIES,
    payload: localities,
  });
};
