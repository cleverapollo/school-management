/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Person, SubjectGroup, UserType, useUser } from '@tyro/api';
import { useMemo } from 'react';
import Table from '../../../../../src/components/table/Table';
import { Option, TableColumn } from '../../../../../src/components/table/types';
import useLocales from '../../../../../src/hooks/useLocales';
import OptionButton from '../../../../../src/components/table/OptionButton';
import Page from '../../../../../src/components/Page';
import useSettings from '../../../../../src/hooks/useSettings';
import { useSubjectGroups } from '../../api/subject-groups';
import { ColoredBox } from '../../components/ColoredBox';
import { MultiPersonsAvatars } from '../../components/MultiPersonsAvatars';

interface SubjectGroupData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

const teacherOptions: Option<SubjectGroupData>[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
];

export const adminOptions: Option<SubjectGroupData>[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'edit',
    icon: 'edit',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'archive',
    icon: 'archive',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'delete',
    icon: 'delete',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
];

const getSubjectGroupColumns = (
  translate: (text: any, options?: any) => string,
  isAdminUserType: boolean,
  isTabsNeeded: boolean
): TableColumn<SubjectGroupData>[] => [
  {
    columnDisplayName: 'id',
    fieldName: 'partyId',
  },
  {
    columnDisplayName: translate('name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('subject'),
    fieldName: 'subjects',
    filter: 'suggest',
    component: ({ row }) => {
      const subject = row.original.subjects?.find(() => true);
      return subject?.name;
    },
  },
  {
    columnDisplayName: translate('members'),
    fieldName: 'studentMembers.memberCount',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('level'),
    fieldName: 'irePP.level',
    filter: 'suggest',
    component: ({ row }) => (
      <ColoredBox content={row.original.irePP?.level ?? undefined} />
    ),
  },
  {
    columnDisplayName: isAdminUserType
      ? translate('teacher')
      : translate('programme'),
    fieldName: 'staff',
    filter: 'suggest',
    component: ({ row }) => {
      const teachers = row.original.staff as [Person];

      return <MultiPersonsAvatars person={teachers} />;
    },
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: (columnProps) => (
      <Button
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {columnProps.row.original.firstButton}
      </Button>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: () =>
      isTabsNeeded && (
        <OptionButton
          options={isAdminUserType ? adminOptions : teacherOptions}
        />
      ),
  },
];

export default function SubjectGroups() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useSubjectGroups();
  const profileTypeName = activeProfile?.profileType?.userType;
  const isAdminUserType = profileTypeName === UserType.Admin;
  const isTabsNeeded =
    profileTypeName === UserType.Admin || profileTypeName === UserType.Teacher;

  const subjectGroupData: SubjectGroupData[] =
    data?.map(
      (group) =>
        (({
          ...group,
          firstButton: translate('view'),
          tech: '',
        } as SubjectGroupData) || [])
    ) || [];

  const subjectGroupColumns = useMemo(
    () => getSubjectGroupColumns(translate, isAdminUserType, isTabsNeeded),
    [translate, isAdminUserType, isTabsNeeded]
  );

  return (
    <Page title="Subject groups" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Subject groups
        </Typography>
        <Table
          data={subjectGroupData}
          columns={subjectGroupColumns}
          // ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id: string) => {
            navigate(`./${id}/view`);
          }}
        />
      </Container>
    </Page>
  );
}
