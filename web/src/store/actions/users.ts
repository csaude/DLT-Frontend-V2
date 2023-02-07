import { GET_NAMES } from "./types";
import { getNamesQuery  } from "@app/utils/users";

export const getNames = () => async (dispatch) => {

    const names = await getNamesQuery()
    
    dispatch({
      type: GET_NAMES,
      payload: names,
    })
};