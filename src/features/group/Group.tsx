import { useEffect, useState, SyntheticEvent, FC } from "react";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { CustomGroupListItem, EnrolmentGroupListItem, SubjectGroupListItem } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { GroupTypes, TableColumn } from '../../components/table/types';
import { Button, Avatar } from "@mui/material";
import useLocales from "../../hooks/useLocales";
import { CUSTOM_GROUP_TYPE, PROFILE_TYPE_NAMES, SUBJECT_GROUP_LEVEL } from "../../constants";
import { fetchEnrolmentGroups, fetchSubjectGroups, fetchCustomGroups } from "../../store/slices/groups";
import OptionButton from "../../components/table/OptionButton";
import ColoredBox from "../groups/components/ColoredBox";
import { enrolmentOptions, subjectOptions, customOptions } from './constants';
import { GROUP_TYPES } from "../../components/table/constants";

interface EnrolmentExactGroupData extends EnrolmentGroupListItem {
  tech?: string;
}

interface SubjectExactGroupData extends SubjectGroupListItem {
  tech?: string;
}

interface CustomExactGroupData extends CustomGroupListItem {
  tech?: string;
}

//ToDo: change this mocks to data from the backend
const ExampleEnrolmentGroupData: EnrolmentExactGroupData[] = [
  {
    name: 'Margaret Donelly',
    avatarUrl: ' ',
    currentActivity: 'Accounting with Imogen Barry, room 207',
    additionalInformation: 'Medical requirement',
  },
  {
    name: 'Bianka Lancaster',
    avatarUrl: ' ',
    currentActivity: '',
    additionalInformation: '',
  },
  {
    name: 'Husna Navarro',
    avatarUrl: ' ',
    currentActivity: 'Science with Reggie Delaney',
    additionalInformation: 'Support plan',
  }
];

const ExampleSubjectGroupData: SubjectExactGroupData[] = [
  {
    name: 'Margaret Donnelly',
    avatarUrl: ' ',
    class: 'Pearse',
    level: SUBJECT_GROUP_LEVEL.HIGHER,
    additionalInformation: 'Medical requirement',
    examinable: '',
    tutor: 'Imogen Byrne',
  },
  {
    name: 'Bianka Lancaster',
    avatarUrl: ' ',
    class: 'Yeats',
    level: SUBJECT_GROUP_LEVEL.COMMON,
    additionalInformation: 'Well-being check',
    examinable: '',
    tutor: 'Mia Barry',
  },
  {
    name: 'Husna Navarro',
    avatarUrl: ' ',
    class: 'Pearse',
    level: SUBJECT_GROUP_LEVEL.ORDINARY,
    additionalInformation: 'Support plan',
    examinable: '',
    tutor: 'Reggie Delaney',
  },
];

const ExampleCustomGroupData: CustomExactGroupData[] = [
  {
    name: 'Margaret Donnelly',
    avatarUrl: ' ',
    class: 'Pearse',
    year: '6',
    tutor: 'Imogen Byrne',
    yearhead: 'Ian Ellis',
    programme: 'Leaving Certificate',
  },
  {
    name: 'Bianka Lancaster',
    avatarUrl: ' ',
    class: 'Yeats',
    year: '4',
    tutor: 'Mia Barry',
    yearhead: 'Ian Ellis',
    programme: 'Leaving Certificate',
  },
];

interface ExampleExactGroup {
  name: string;
  id: string;
  type: GroupTypes;
  list: EnrolmentExactGroupData[] | SubjectExactGroupData[] | CustomExactGroupData[];
}

const ExampleGroupData: ExampleExactGroup = {
  name: 'Pears',
  id: '1',
  type: GROUP_TYPES.ENROLMENT,//GROUP_TYPES.ENROLMENT, //GROUP_TYPES.SUBJECT, //GROUP_TYPES.CUSTOM,
  list: ExampleEnrolmentGroupData, //ExampleEnrolmentGroupData, //ExampleSubjectGroupData, //ExampleCustomGroupData
}

interface IProps {
  id?: string;
}

const Group: FC<IProps> = ({ id }) => {
  const { translate } = useLocales();
  const profileTypeName = useTypedSelector(state => state.auth.activeProfile?.profileType?.name);

  // useEffect(() => {
  //   storeDispatch(fetchExactGroup(id));
  // }, []);

  const enrolmentGroupColumns: TableColumn<EnrolmentExactGroupData>[] = [
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
      isSortNeeded: true,
      component: (columnProps) => {
        return (<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar srcSet={columnProps.row.original.avatarUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }}/>
          {columnProps.row.original.name}
        </div>)
      },
    },
    {
      columnDisplayName: translate('currentActivity'),
      fieldName: 'currentActivity',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('additionalInformation'),
      fieldName: 'additionalInformation',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
      component: (columnProps) => (
        <OptionButton options={enrolmentOptions} />
      )
    },
  ];

  const subjectGroupColumns: TableColumn<SubjectExactGroupData>[] = [
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
      isSortNeeded: true,
      component: (columnProps) => {
        return (<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar srcSet={columnProps.row.original.avatarUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }}/>
          {columnProps.row.original.name}
        </div>)
      },
    },
    {
      columnDisplayName: translate('class'),
      fieldName: 'class',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('level'),
      fieldName: 'level',
      filter: 'suggest',
      component: (columnProps) => <ColoredBox content={columnProps.row.original.level} />
    },
    {
      columnDisplayName: translate('additionalInformation'),
      fieldName: 'additionalInformation',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('examinable'),
      fieldName: 'examinable',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('tutor'),
      fieldName: 'tutor',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
      component: (columnProps) => (
        <OptionButton options={subjectOptions} />
      )
    },
  ];

  const customGroupColumns: TableColumn<CustomExactGroupData>[] = [
    {
      columnDisplayName: translate('name'),
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
      isSortNeeded: true,
      component: (columnProps) => {
        return (<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar srcSet={columnProps.row.original.avatarUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }}/>
          {columnProps.row.original.name}
        </div>)
      },
    },
    {
      columnDisplayName: translate('class'),
      fieldName: 'class',
      filter: 'suggest',
    },
    {
      columnDisplayName: translate('year'),
      fieldName: 'year',
      filter: 'suggest',
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
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
      component: (columnProps) => (
        <OptionButton options={customOptions} />
      )
    },
  ];

  const enrolmentGroupData: EnrolmentExactGroupData[] = ExampleGroupData.type === GROUP_TYPES.ENROLMENT ?
  (ExampleGroupData.list?.map(group => (
    { ...group,
      tech: '',
    } as EnrolmentExactGroupData) || []
  ) || []) : [];

  const subjectGroupData: SubjectExactGroupData[] = ExampleGroupData.type === GROUP_TYPES.SUBJECT ? 
  (ExampleGroupData.list?.map(group => {
    return { ...group,
      tech: '',
    } as SubjectExactGroupData || [] 
  }) || []) : [];

  const customGroupData: CustomExactGroupData[] = ExampleGroupData.type === GROUP_TYPES.CUSTOM ? 
  (ExampleGroupData.list?.map(group => (
    { ...group,
      tech: '',
    } as CustomExactGroupData) || []
  ) || []) : [];

  switch(ExampleGroupData.type) {
    case GROUP_TYPES.ENROLMENT:
      return (
        <Table
          title={`${ExampleGroupData.name} ${translate('memberList')}`}
          story={[translate('enrolmentGroups'), ExampleGroupData.name, translate('list')]}
          data={enrolmentGroupData}
          columns={enrolmentGroupColumns}
          isRowSelectionNeeded
        />
      );
    case GROUP_TYPES.SUBJECT:
      return (
        <Table
          title={`${ExampleGroupData.name} ${translate('memberList')}`}
          story={[translate('subjectGroups'), ExampleGroupData.name, translate('list')]}
          data={subjectGroupData}
          columns={subjectGroupColumns}
          isRowSelectionNeeded
        />
      );
    case GROUP_TYPES.CUSTOM:
      return (
        <Table
          title={`${ExampleGroupData.name} ${translate('memberList')}`}
          story={[translate('customGroups'), ExampleGroupData.name, translate('list')]}
          data={customGroupData}
          columns={customGroupColumns}
          isRowSelectionNeeded
        />
      );
    default: 
      return (
        <Table
          title={`${ExampleGroupData.name} ${translate('memberList')}`}
          story={[translate('enrolmentGroups'), ExampleGroupData.name, translate('list')]}
          data={enrolmentGroupData}
          columns={enrolmentGroupColumns}
          isRowSelectionNeeded
        />
      );
  }
}

export default Group;
