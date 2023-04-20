import { GET_USERNAMES } from "./types";
import { getUsernamesQuery  } from "@app/utils/users";

export const getUsernames = () => async (dispatch) => {

    const names = await getUsernamesQuery()
    
    dispatch({
      type: GET_USERNAMES,
      payload: names,
    })
};