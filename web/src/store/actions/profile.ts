import { GET_PROFILES } from "./types";
import { getProfilesQuery } from "@app/utils/profiles";

export const getProfiles = () => async (dispatch) => {
  const profiles = await getProfilesQuery();

  dispatch({
    type: GET_PROFILES,
    payload: profiles,
  });
};
