import { GET_USERNAMES, LOAD_REFERERS, GET_USERS_LAST_SYNC } from "./types";
import { getUsernamesQuery, getUsersLastSync } from "@app/utils/users";

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

export const getUsersLastSynchronization = () => async (dispatch) => {
  const lastSync = await getUsersLastSync();

  dispatch({
    type: GET_USERS_LAST_SYNC,
    payload: lastSync,
  });
};
