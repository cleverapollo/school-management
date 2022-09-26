import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GlobalUser, Maybe, MyAuthDetailsDocument, MyAuthDetailsQuery, Profile } from "../../app/api/generated";
import { apolloClient } from "../../app/api/apollo";
import { dispatch } from "../store";
import { AccountInfo } from '@azure/msal-browser';

interface AuthSliceState {
  user: Maybe<AccountInfo>,
  isAuthenticated: boolean,
  activeProfile: Maybe<Profile>,
  permissions: Array<string>
}
const initialState: AuthSliceState = {
  user: null,
  isAuthenticated: false,
  activeProfile: null,
  permissions: []
}


const mapPermissions = (profile: Profile): Array<string> => profile.permissionIds?.map(a => a as string) as Array<string>

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    authDetailsSuccess: (state, action: PayloadAction<AccountInfo>) => {
      state.user = action.payload
    },
    setActiveProfile: (state, action: PayloadAction<Number>) => {
      // state.activeProfile = state.user?.profiles?.find(p => p?.id === action.payload) as Profile
      // state.permissions = mapPermissions(state.activeProfile)

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

      // dispatch(slice.actions.authDetailsSuccess(response.data.myAuthDetails as GlobalUser));

    } catch (error) {
    }
  };
}
