import { createSlice } from '@reduxjs/toolkit'
import {GlobalUser, MyAuthDetailsDocument, Profile} from "../../app/api/generated";
import {apolloClient} from "../../app/api/apollo";
import {dispatch} from "../store";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  activeProfile: null,
} as { user: GlobalUser| null; token: string | null; isAuthenticated: boolean, activeProfile: Profile | null }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    authDetailsSuccess: (state, action) => {
      let activeProfileId = action.payload.myAuthDetails?.activeProfileId
      state.user = action.payload.myAuthDetails as GlobalUser
      var activeProfile = state.user.profiles?.find(a => a?.id === activeProfileId) as Profile
      state.activeProfile = activeProfile
      state.user = action.payload;
    },
  },
})

export const { logout, authDetailsSuccess } = slice.actions
export default slice.reducer


export function updateEvent(
  eventId: string,
  updateEvent: Partial<{
    allDay: boolean;
    start: Date | null;
    end: Date | null;
  }>
) {
  return async () => {
    try {
      var response = await apolloClient.query({query : MyAuthDetailsDocument})
      console.log('-=-=-=---=-=-=-')
      console.log(response);
      dispatch(slice.actions.authDetailsSuccess(response.data));

    } catch (error) {
    }
  };
}
