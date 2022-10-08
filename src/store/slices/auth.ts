import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GlobalUser, Maybe, MyAuthDetailsDocument, MyAuthDetailsQuery, Profile } from "../../app/api/generated";
import { apolloClient } from "../../app/api/apollo";
import { dispatch } from "../store";

interface AuthSliceState {
  user: Maybe<GlobalUser>,
  isUserAuthenticated: boolean,
  activeProfile: Maybe<Profile>,
  permissions: Array<string>
}
const initialState: AuthSliceState = {
  user: null,
  isUserAuthenticated: false,
  activeProfile: null,
  permissions: []
}


const mapPermissions = (profile: Profile): Array<string> => profile.permissionIds?.map(a => a as string) as Array<string>

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    authDetailsSuccess: (state: AuthSliceState, action: PayloadAction<GlobalUser>) => {
      let activeProfileId = action.payload.activeProfileId
      state.isUserAuthenticated = true;
      state.user = action.payload;
      state.user.profiles = state.user?.profiles?.map(p => p as Profile)
        .map(p => {
          p.nickName = p?.nickName ?? state.user?.name
          return p
        })
      let activeProfile = state.user.profiles?.find(a => a?.id === activeProfileId) as Profile;
      activeProfile.nickName = activeProfile.nickName ?? state.user.name;
      state.activeProfile = activeProfile;
      state.permissions = mapPermissions(activeProfile)

    },
    setActiveProfile: (state, action: PayloadAction<Number>) => {
      state.activeProfile = state.user?.profiles?.find(p => p?.id === action.payload) as Profile
      state.permissions = mapPermissions(state.activeProfile)
      state.activeProfile = state.user?.profiles?.find(p => p?.id === action.payload) as Profile
      state.permissions = mapPermissions(state.activeProfile)
    }
  }
  ,
})

export const { logout, authDetailsSuccess, setActiveProfile } = slice.actions
export default slice.reducer


export function updateEvent(
) {
  return async () => {
    try {
      var response = await apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })

      dispatch(slice.actions.authDetailsSuccess(response.data.myAuthDetails as GlobalUser));

    } catch (error) {
    }
  };
}
