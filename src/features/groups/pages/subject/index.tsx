import Table from '../../../../components/table/Table';
import { Option, TableColumn } from '../../../../components/table/types';
import { Button, Container, Typography } from "@mui/material";
import { useTranslation, TFunction } from '@tyro/i18n';
import OptionButton from "../../../../components/table/OptionButton";
import { useNavigate } from "react-router";
import { Person, SubjectGroup, UserType, useUser } from '@tyro/api';
import { useMemo } from 'react';
import Page from '../../../../components/Page';
import useSettings from '../../../../hooks/useSettings';
import { useSubjectGroups } from '../../api/subject-groups';
import ColoredBox from '../../components/ColoredBox';
import MultiPersonsAvatars from "../../components/MultiPersonsAvatars";

interface SubjectGroupData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

const teacherOptions: Option<SubjectGroupData>[] = [
    {
        text: 'notify',
        icon: 'notify',
        action: (e) => {e.stopPropagation()},
    }
    ]

export const adminOptions: Option<SubjectGroupData>[] = [
    {
        text: 'notify',
        icon: 'notify',
        action: (e) => {e.stopPropagation()},
    },
    {
        text: 'edit',
        icon: 'edit',
        action: (e) => {e.stopPropagation()},
    },
    {
        text: 'archive',
        icon: 'archive',
        action: (e) => {e.stopPropagation()},
    },
    {
        text: 'delete',
        icon: 'delete',
        action: (e) => {e.stopPropagation()},
    },
];

const getSubjectGroupColumns = (translate: TFunction<("common" | "authentication")[], undefined, ("common" | "authentication")[]>, isAdminUserType: boolean, isTabsNeeded: boolean): TableColumn<SubjectGroupData>[] => ([
  {
    columnDisplayName: 'id',
    fieldName: 'partyId',
  },
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('authentication:subject'),
    fieldName: 'subjects',
    filter: 'suggest',
    component: ({ row }) => {
      var subject = row.original.subjects?.find(() => true)
      return subject?.name
    }
  },
  {
    columnDisplayName: translate('common:members'),
    fieldName: 'studentMembers.memberCount',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:level'),
    fieldName: 'irePP.level',
    filter: 'suggest',
    component: ({ row }) => <ColoredBox content={row.original.irePP?.level ?? undefined} />
  },
  {
    columnDisplayName: isAdminUserType ? translate('common:teacher') : translate('authentication:programme'),
    fieldName: 'staff',
    filter: 'suggest',
    component: ({ row }) => {
      var teachers = row.original.staff as [Person]

      return <MultiPersonsAvatars person={teachers}/>
    }
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: (columnProps) => {
      return (<Button onClick={(e) => { e.stopPropagation() }}>
        {columnProps.row.original.firstButton}
      </Button>)
    }
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: () => {
      return isTabsNeeded && (
        <OptionButton options={isAdminUserType ? adminOptions : teacherOptions} />
      );
    },
  },
]);

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'authentication']);
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useSubjectGroups();
  const profileTypeName = activeProfile?.profileType?.userType;
  const isAdminUserType = profileTypeName === UserType.Admin;
  const isTabsNeeded = profileTypeName === UserType.Admin || profileTypeName === UserType.Teacher;

  const subjectGroupData: SubjectGroupData[] = data?.map(group => {
    return {
      ...group,
      firstButton: t('common:actions.view'),
      tech: ''
    } as SubjectGroupData || []
  }) || [];

  const subjectGroupColumns = useMemo(() => getSubjectGroupColumns(t, isAdminUserType, isTabsNeeded), [t, isAdminUserType, isTabsNeeded]);

  return (
    <Page title="Subject groups" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Subject groups
        </Typography>
        <Table
          data={subjectGroupData}
          columns={subjectGroupColumns}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`./${id}/view`); }}
        />
      </Container>
    </Page>
  );
}
