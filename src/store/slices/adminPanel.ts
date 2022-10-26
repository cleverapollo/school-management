import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Maybe, PartyPerson, Tenant } from "../../app/api/generated";

interface AdminPanelSliceState {
  tenants: Maybe<Tenant[]>;
  partyPeople: Maybe<PartyPerson[]>;
  isLoading: boolean;
  isError: boolean;
}

const initialState: AdminPanelSliceState = {
  tenants: null,
  partyPeople: null,
  isLoading: false,
  isError: false,
}

const slice = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    adminPanelRequest: (state: AdminPanelSliceState) => { state.isLoading = true; },
    adminTenantsSuccess: (state: AdminPanelSliceState, action: PayloadAction<Tenant[]>) => {
      state.tenants = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.partyPeople = null;
    },
    adminPartyPeopleSuccess: (state, action: PayloadAction<PartyPerson[]>) => {
      state.isLoading = false;
      state.isError = false;
      state.partyPeople = action.payload;
    },
    adminPanelError: (state: AdminPanelSliceState) => { 
      state.isLoading = false;
      state.isError = true;
    }
  }
  ,
})

export const { adminPanelRequest, adminTenantsSuccess, adminPartyPeopleSuccess, adminPanelError } = slice.actions;
export default slice.reducer;
