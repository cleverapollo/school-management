import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apolloClient } from '../../app/api/apollo';
import { Maybe, MyAdminPartyPeopleDocument, MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables, MyAdminTenantsDocument, MyAdminTenantsQuery, MyAuthDetailsDocument, MyAuthDetailsQuery, PartyPerson, Tenant } from "../../app/api/generated";

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

export const fetchTenants = createAsyncThunk(
  'adminPanel/fetchTenants',
  async () => {
    const response = await apolloClient.query<MyAdminTenantsQuery>({ query: MyAdminTenantsDocument })
    return response.data.admin__tenants;
  }
);

export const fetchPartyPeople = createAsyncThunk(
  'adminPanel/fetchPartyPeople',
  async (tenant: number) => {
    const response = await apolloClient.query<MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables>(
      { query: MyAdminPartyPeopleDocument, variables: { tenant } });
    return response.data.admin__party_people.map(person => (
      { ...person, tenant, name: person.firstName + person.lastName })
      ) as PartyPerson[];
  }
);

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
    },
    resetAdminPanelState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTenants.fulfilled, (state, action) => {
      state.tenants = action.payload;
      state.isLoading = false;
      state.isError = false;
    })
    builder.addCase(fetchPartyPeople.fulfilled, (state, action) => {
      state.partyPeople = action.payload;
      state.isLoading = false;
      state.isError = false;
    })
  },
})

export const { adminPanelRequest, adminTenantsSuccess, adminPartyPeopleSuccess, adminPanelError, resetAdminPanelState } = slice.actions;
export default slice.reducer;
