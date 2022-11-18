import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apolloClient } from '../../app/api/apollo';
import { CustomGroup, CustomGroupDocument, CustomGroupQuery, EnrolmentGroup, EnrolmentGroupDocument, EnrolmentGroupQuery, Maybe, MyAdminPartyPeopleDocument, MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables, MyAdminTenantsDocument, MyAdminTenantsQuery, MyAuthDetailsDocument, MyAuthDetailsQuery, PartyPerson, SubjectGroup, SubjectGroupDocument, SubjectGroupLevel, SubjectGroupQuery, Tenant } from "../../app/api/generated";

interface GroupsSliceState {
  enrolmentGroups: Maybe<EnrolmentGroup[]>;
  subjectGroups: Maybe<SubjectGroup[]>;
  customGroups: Maybe<CustomGroup[]>;
  isLoading: boolean;
  isError: boolean;
}

const initialState: GroupsSliceState = {
  enrolmentGroups: null,
  subjectGroups: null,
  customGroups: null,
  isLoading: false,
  isError: false,
}

export const fetchEnrolmentGroups = createAsyncThunk(
  'groups/fetchEnrolmentGroups',
  async () => {
    const response = await apolloClient.query<EnrolmentGroupQuery>({ query: EnrolmentGroupDocument })
    return response.data.generalGroups.map(group => ({ 
      name: group.name, 
      members: group.studentCount.toString(), 
      programme: group.programmeStages[0].programmeStage.programme.name,
      //ToDo: change this mocks to data from backend when it will be implemented
      year: '1',
      tutor: 'Rachel',
      yearhead: 'Rachel',
      id: group.partyId.toString(),
    })) as EnrolmentGroup[];
  }
);

export const fetchSubjectGroups = createAsyncThunk(
  'groups/fetchSubjectGroups',
  async () => {
    const response = await apolloClient.query<SubjectGroupQuery>({ query: SubjectGroupDocument });
    return response.data.subjectGroups.map(group => ({
      name: group.name,
      subject: group.subjects[0].name,
      members: group.studentCount.toString(),
      level: group.irePP.level,
      programme: group.programmeStages[0].programmeStage.programme.name,
      //ToDo: change this mocks to data from backend when it will be implemented
      teacher: 'Rachel',
      id: group.partyId.toString(),
    })) as SubjectGroup[];
  }
);

export const fetchCustomGroups = createAsyncThunk(
  'groups/fetchCustomGroups',
  async () => {
    const response = await apolloClient.query<CustomGroupQuery>({ query: CustomGroupDocument })
    return response.data.customGroups;
  }
);

const slice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    groupsRequest: (state: GroupsSliceState) => { state.isLoading = true; },
    enrolmentGroupsSuccess: (state: GroupsSliceState, action: PayloadAction<EnrolmentGroup[]>) => {
      state.enrolmentGroups = action.payload;
      state.isLoading = false;
      state.isError = false;
    },
    subjectGroupsSuccess: (state: GroupsSliceState, action: PayloadAction<SubjectGroup[]>) => {
      state.isLoading = false;
      state.isError = false;
      state.subjectGroups = action.payload;
    },
    customGroupsSuccess: (state: GroupsSliceState, action: PayloadAction<CustomGroup[]>) => {
      state.isLoading = false;
      state.isError = false;
      state.customGroups = action.payload;
    },
    groupsError: (state: GroupsSliceState) => { 
      state.isLoading = false;
      state.isError = true;
    },
    resetGroupsState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEnrolmentGroups.fulfilled, (state, action) => {
      state.enrolmentGroups = action.payload;
      state.isLoading = false;
      state.isError = false;
    })
    builder.addCase(fetchSubjectGroups.fulfilled, (state, action) => {
      state.subjectGroups = action.payload;
      state.isLoading = false;
      state.isError = false;
    })
    // builder.addCase(fetchCustomGroups.fulfilled, (state, action) => {
    //   state.customGroups = action.payload;
    //   state.isLoading = false;
    //   state.isError = false;
    // })
  },
})

export const { 
  groupsRequest, 
  enrolmentGroupsSuccess, 
  subjectGroupsSuccess, 
  customGroupsSuccess, 
  groupsError, 
  resetGroupsState 
} = slice.actions;
export default slice.reducer;
