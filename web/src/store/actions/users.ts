import { GET_USERNAMES, LOAD_REFERERS } from "./types";
import { getUsernamesQuery } from "@app/utils/users";

export const getUsernames = () => async (dispatch) => {
  const names = await getUsernamesQuery();

  dispatch({
    type: GET_USERNAMES,
    payload: names,
  });
};

export const loadReferers = (referers) => async (dispatch) => {
  dispatch({
    type: LOAD_REFERERS,
    payload: referers,
  });
};
