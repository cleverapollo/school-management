import { useEffect, useState, SyntheticEvent } from "react";
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material';
import { apolloClient } from "../../app/api/apollo";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { adminPanelRequest, fetchTenants, fetchPartyPeople, resetAdminPanelState } from "../../store/slices/adminPanel";
import { CustomGroup, EnrolmentGroup, GlobalUser, MyAdminPartyPeopleDocument, MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables, MyAdminTenantsDocument, MyAdminTenantsQuery, MyAuthDetailsDocument, MyAuthDetailsQuery, PartyPerson, SubjectGroup, Tenant } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { TableColumn, TitleOverride } from '../../components/table/types';
import { Button } from "@mui/material";
import { authDetailsSuccess } from "../../store/slices/auth";
import { addEmulationHeaders } from "../../utils/emulateUser";
import useLocales from "../../hooks/useLocales";
import { PROFILE_TYPE_NAMES } from "../../constants";
import { fetchEnrolmentGroups, fetchSubjectGroups, fetchCustomGroups } from "../../store/slices/groups";

interface EnrolmentGroupData extends EnrolmentGroup {
  members: string;
  year: string;
  tutor: string;
  yearhead: string;
  programme: string;
  firstButton?: string;
  tech?: string;
}

interface SubjectGroupData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

interface CustomGroupData extends CustomGroup {
  firstButton?: string;
  tech?: string;
}

const ExampleEnrolmentGroupData: EnrolmentGroupData[] = [
  {
    name: 'Pears',
    members: '27',
    year: '1',
    tutor: 'Rachel Dowling',
    yearhead: 'Rachel Dowling',
    programme: 'Junior Cycle',
  }
];

const ExampleSubjectGroupData: SubjectGroupData[] = [
  {
    name: '1 Math A',
    subject: 'Maths',
    members: '29',
    level: 'Higher',
    teacher: 'Rachel Downing',
    programme: 'Junior Cycle',
  }
];

const ExampleCustomGroupData: CustomGroupData[] = [
  {
    name: 'All students 2023',
    members: '965',
    type: 'Dynamic',
    created: 'Rachel Downing',
  }
];

const Groups = () => {
  const { translate } = useLocales();
  const profileTypeName = useTypedSelector(state => state.auth.activeProfile?.profileType?.name);
  // const ExampleEnrolmentGroupData = useTypedSelector(state => state.groups.enrolmentGroups);
  // const ExampleSubjectGroupData = useTypedSelector(state => state.groups.subjectGroups);
  // const ExampleCustomGroupData = useTypedSelector(state => state.groups.customGroups);
  const [tabValue, setTabValue] = useState('0');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    // switch(newValue) {
    //   case '0': 
    //     storeDispatch(fetchEnrolmentGroups());
    //     break;
    //   case '1': 
    //     storeDispatch(fetchSubjectGroups());
    //     break;
    //   case '2': 
    //     storeDispatch(fetchCustomGroups());
    //     break;
    //   default: 
    //     storeDispatch(fetchEnrolmentGroups());
    //     break;
    // }
  };

  useEffect(() => {
    storeDispatch(fetchEnrolmentGroups());
  }, []);

  const enrolmentGroupColumns: TableColumn<EnrolmentGroupData>[] = [
    {
      columnDisplayName: 'Name',
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Members',
      fieldName: 'members',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Year',
      fieldName: 'year',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Tutor',
      fieldName: 'tutor',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Yearhead',
      fieldName: 'yearhead',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Programme',
      fieldName: 'programme',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={() => {}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];

  const subjectGroupColumns: TableColumn<SubjectGroupData>[] = [
    {
      columnDisplayName: 'Name',
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Subject',
      fieldName: 'subject',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Members',
      fieldName: 'members',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Level',
      fieldName: 'level',
      filter: 'suggest',
    },
    {
      columnDisplayName: profileTypeName === PROFILE_TYPE_NAMES.ADMIN ? 'Teacher' : 'Programme',
      fieldName: profileTypeName === PROFILE_TYPE_NAMES.ADMIN ? 'teacher' : 'programme',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={() => {}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];

  const customGroupColumns: TableColumn<CustomGroupData>[] = [
    {
      columnDisplayName: 'Name',
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Members',
      fieldName: 'members',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Type',
      fieldName: 'type',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Created',
      fieldName: 'created',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={() => {}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];

  const enrolmentGroupData: EnrolmentGroupData[] = ExampleEnrolmentGroupData.map(group => (
    { ...group,
      firstButton: profileTypeName === PROFILE_TYPE_NAMES.ADMIN ? 'view' : 'notify', 
      tech: ''
    } as EnrolmentGroupData) || []
  );

  const subjectGroupData: SubjectGroupData[] = ExampleSubjectGroupData.map(group => {
    return { ...group,
      teacher: profileTypeName === PROFILE_TYPE_NAMES.ADMIN ? group.teacher : undefined,
      programme: profileTypeName === PROFILE_TYPE_NAMES.ADMIN ? undefined : group.programme,
      firstButton: 'view', 
      tech: ''
    } as SubjectGroupData || [] 
  });

  const customGroupData: CustomGroupData[] = ExampleCustomGroupData.map(group => (
    { ...group,
      firstButton: 'view', 
      tech: ''
    } as CustomGroupData) || []
  );

  switch(tabValue) {
    case '0':
      return (
        <Table
          title={translate('groups')}
          data={enrolmentGroupData}
          columns={enrolmentGroupColumns}
          tabs={['Enrolment Groups', 'Subject Groups', 'Custom Groups']}
          onChangeTab={handleChange}
          tabValue={tabValue}
        />
      );
    case '1':
      return (
        <Table
          title={translate('groups')}
          data={subjectGroupData}
          columns={subjectGroupColumns}
          tabs={['Enrolment Groups', 'Subject Groups', 'Custom Groups']}
          onChangeTab={handleChange}
          tabValue={tabValue}
        />
      );
    case '2':
      return (
        <Table
          title={translate('groups')}
          data={customGroupData}
          columns={customGroupColumns}
          tabs={['Enrolment Groups', 'Subject Groups', 'Custom Groups']}
          onChangeTab={handleChange}
          tabValue={tabValue}
        />
      );
    default: 
      return null;
  }
}

export default Groups;
