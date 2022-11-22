import { useEffect, useState, SyntheticEvent } from "react";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { CustomGroup, EnrolmentGroup, SubjectGroup } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { TableColumn } from '../../components/table/types';
import { Button } from "@mui/material";
import useLocales from "../../hooks/useLocales";
import { CUSTOM_GROUP_TYPE, PROFILE_TYPE_NAMES, SUBJECT_GROUP_LEVEL } from "../../constants";
import { fetchEnrolmentGroups, fetchSubjectGroups, fetchCustomGroups } from "../../store/slices/groups";
import OptionButton from "../../components/table/OptionButton";
import ColoredBox from "./components/ColoredBox";
import { adminOptions, teacherOptions } from "./contants";
import { useNavigate } from "react-router";
import { useUser } from '@tyro/api';

interface EnrolmentGroupData extends EnrolmentGroup {
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

// const ExampleEnrolmentGroupData: EnrolmentGroupData[] = [
//   {
//     id: '1',
//     name: 'Pears',
//     members: '27',
//     year: '1',
//     tutor: 'Rachel Dowling',
//     yearhead: 'Rachel Dowling',
//     programme: 'Junior Cycle',
//   }
// ];

// const ExampleSubjectGroupData: SubjectGroupData[] = [
//   {
//     name: '1 Math A',
//     subject: 'Maths',
//     members: '29',
//     level: SUBJECT_GROUP_LEVEL.HIGHER,
//     teacher: 'Rachel Downing',
//     programme: 'Junior Cycle',
//   },
//   {
//     name: '2 History A',
//     subject: 'History',
//     members: '21',
//     level: SUBJECT_GROUP_LEVEL.COMMON,
//     teacher: 'Rachel Downing',
//     programme: 'Junior Cycle',
//   },
//   {
//     name: '3 Biology A',
//     subject: 'Biology',
//     members: '9',
//     level: SUBJECT_GROUP_LEVEL.ORDINARY,
//     teacher: 'Rachel Downing',
//     programme: 'Junior Cycle',
//   }
// ];

const ExampleCustomGroupData: CustomGroupData[] = [
  {
    name: 'All students 2023',
    members: '965',
    type: CUSTOM_GROUP_TYPE.DYNAMIC,
    created: 'Rachel Downing',
    id: '1',
  },
  {
    name: 'My group',
    members: '15',
    type: CUSTOM_GROUP_TYPE.STATIC,
    created: "Niall O'Reilly",
    id: '2',
  },
];

const Groups = () => {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const profileTypeName = activeProfile?.profileType?.name;
  const ExampleEnrolmentGroupData = useTypedSelector(state => state.groups.enrolmentGroups);
  const ExampleSubjectGroupData = useTypedSelector(state => state.groups.subjectGroups);
  // const ExampleCustomGroupData = useTypedSelector(state => state.groups.customGroups);
  const isTabsNeeded = profileTypeName === PROFILE_TYPE_NAMES.ADMIN || profileTypeName === PROFILE_TYPE_NAMES.TEACHER;
  const [tabValue, setTabValue] = useState(isTabsNeeded ? '0': null);
  const isAdminUserType = profileTypeName === PROFILE_TYPE_NAMES.ADMIN;

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    switch(newValue) {
      case '0': 
        storeDispatch(fetchEnrolmentGroups());
        break;
      case '1': 
        storeDispatch(fetchSubjectGroups());
        break;
    //   case '2': 
    //     storeDispatch(fetchCustomGroups());
    //     break;
      default: break;
    }
  };

  useEffect(() => {
    storeDispatch(fetchEnrolmentGroups());
    //tabValue ? storeDispatch(fetchEnrolmentGroups()) : storeDispatch(fetchCustomGroups());
  }, []);

  const enrolmentGroupColumns: TableColumn<EnrolmentGroupData>[] = [
    {
      columnDisplayName: 'id',
      fieldName: 'id',
    },
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('members'),
      fieldName: 'members',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('year'),
      fieldName: 'year',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('tutor'),
      fieldName: 'tutor',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('yearhead'),
      fieldName: 'yearhead',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('programme'),
      fieldName: 'programme',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={(e) => {e.stopPropagation()}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
      component: (columnProps) => {
        return isAdminUserType && (
          <OptionButton options={adminOptions} />
        );
      },
    },
  ];

  const subjectGroupColumns: TableColumn<SubjectGroupData>[] = [
    {
      columnDisplayName: 'id',
      fieldName: 'id',
    },
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('subject'),
      fieldName: 'subject',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('members'),
      fieldName: 'members',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('level'),
      fieldName: 'level',
      filter: 'suggest',
      component: (columnProps) => <ColoredBox content={columnProps.row.original.level} />
    },
    {
      columnDisplayName: isAdminUserType ? translate('teacher') : translate('programme'),
      fieldName: isAdminUserType ? 'teacher' : 'programme',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={(e) => {e.stopPropagation()}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
      component: (columnProps) => {
        return isTabsNeeded && (
          <OptionButton options={isAdminUserType ? adminOptions : teacherOptions} />
        );
      },
    },
  ];

  const customGroupColumns: TableColumn<CustomGroupData>[] = [
    {
      columnDisplayName: 'id',
      fieldName: 'id',
    },
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('members'),
      fieldName: 'members',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('type'),
      fieldName: 'type',
      filter: 'suggest',
      isMandatory: true,
      component: (columnProps) => <ColoredBox content={columnProps.row.original.type} />
    },
    {
      columnDisplayName: translate('created'),
      fieldName: 'created',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={(e) => {e.stopPropagation()}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
      component: (columnProps) => {
        return isAdminUserType && (
          <OptionButton options={adminOptions} />
        );
      },
    },
  ];

  const studentsCustomGroupColumns: TableColumn<CustomGroupData>[] = [
    {
      columnDisplayName: 'id',
      fieldName: 'id',
    },
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('teacher'),
      fieldName: 'created',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={(e) => {e.stopPropagation()}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];


  const enrolmentGroupData: EnrolmentGroupData[] = ExampleEnrolmentGroupData?.map(group => (
    { ...group,
      firstButton: isAdminUserType ? translate('view') : translate('notify'), 
      tech: ''
    } as EnrolmentGroupData) || []
  ) || [];

  const subjectGroupData: SubjectGroupData[] = ExampleSubjectGroupData?.map(group => {
    return { ...group,
      teacher: isAdminUserType ? group.teacher : undefined,
      programme: isAdminUserType ? undefined : group.programme,
      firstButton: translate('view'), 
      tech: ''
    } as SubjectGroupData || [] 
  }) || [];

  const customGroupData: CustomGroupData[] = ExampleCustomGroupData.map(group => (
    { ...group,
      firstButton: translate('view'), 
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
          tabs={[translate('enrolmentGroups'), translate('subjectGroups'), translate('customGroups')]}
          onChangeTab={handleChange}
          tabValue={tabValue}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`/group/${id}`); }}
        />
      );
    case '1':
      return (
        <Table
          title={translate('groups')}
          data={subjectGroupData}
          columns={subjectGroupColumns}
          tabs={[translate('enrolmentGroups'), translate('subjectGroups'), translate('customGroups')]}
          onChangeTab={handleChange}
          tabValue={tabValue}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`/group/${id}`); }}
        />
      );
    case '2':
      return (
        <Table
          title={translate('groups')}
          data={customGroupData}
          columns={customGroupColumns}
          tabs={[translate('enrolmentGroups'), translate('subjectGroups'), translate('customGroups')]}
          onChangeTab={handleChange}
          tabValue={tabValue}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`/group/${id}`); }}
        />
      );
    default: 
      return (
        <Table
          title={translate('groups')}
          data={customGroupData}
          columns={studentsCustomGroupColumns}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`/group/${id}`); }}
        />
      );
  }
}

export default Groups;