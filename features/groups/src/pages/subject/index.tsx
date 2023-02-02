/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Person, SubjectGroup, UserType, useUser } from '@tyro/api';
import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Page } from '@tyro/core';
import Table from '../../../../../src/components/table/Table';
import { Option, TableColumn } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';
import { useSubjectGroups } from '../../api/subject-groups';
import { ColoredBox } from '../../components/ColoredBox';
import { MultiPersonsAvatars } from '../../components/MultiPersonsAvatars';

interface SubjectGroupData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

export const getAdminOptions = (
  translate: TFunction<('common')[], undefined, ('common')[]>,
): Option<SubjectGroupData>[] => ([
  {
    text: translate('common:actions.notify'),
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: translate('common:actions.edit'),
    icon: 'edit',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: translate('common:actions.archive'),
    icon: 'archive',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: translate('common:actions.delete'),
    icon: 'delete',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
]);

export const getTeacherOptions = (
  translate: TFunction<('common')[], undefined, ('common')[]>,
): Option<SubjectGroupData>[] => ([
  {
    text: translate('common:actions.notify'),
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
]);

// const teacherOptions: Option<SubjectGroupData>[] = [
//   {
//     text: 'notify',
//     icon: 'notify',
//     action: (e: MouseEvent) => {
//       e.stopPropagation();
//     },
//   },
// ];

// export const adminOptions: Option<SubjectGroupData>[] = [
//   {
//     text: 'notify',
//     icon: 'notify',
//     action: (e: MouseEvent) => {
//       e.stopPropagation();
//     },
//   },
//   {
//     text: 'edit',
//     icon: 'edit',
//     action: (e: MouseEvent) => {
//       e.stopPropagation();
//     },
//   },
//   {
//     text: 'archive',
//     icon: 'archive',
//     action: (e: MouseEvent) => {
//       e.stopPropagation();
//     },
//   },
//   {
//     text: 'delete',
//     icon: 'delete',
//     action: (e: MouseEvent) => {
//       e.stopPropagation();
//     },
//   },
// ];

const getSubjectGroupColumns = (
  translate: TFunction<
    ('common' | 'groups')[],
    undefined,
    ('common' | 'groups')[]
  >,
  isAdminUserType: boolean,
  isTabsNeeded: boolean
): TableColumn<SubjectGroupData>[] => [
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
    columnDisplayName: translate('groups:subject'),
    fieldName: 'subjects',
    filter: 'suggest',
    component: ({ row }) => {
      const subject = row.original.subjects?.find(() => true);
      return subject?.name;
    },
  },
  {
    columnDisplayName: translate('groups:members'),
    fieldName: 'studentMembers.memberCount',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('groups:level'),
    fieldName: 'irePP.level',
    filter: 'suggest',
    component: ({ row }) => (
      <ColoredBox content={row.original.irePP?.level ?? undefined} />
    ),
  },
  {
    columnDisplayName: isAdminUserType
      ? translate('groups:teacher')
      : translate('groups:programme'),
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
          options={isAdminUserType ? getAdminOptions(translate) : getTeacherOptions(translate)}
        />
      ),
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups']);
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data } = useSubjectGroups();
  const profileTypeName = activeProfile?.profileType?.userType;
  const isAdminUserType = profileTypeName === UserType.Admin;
  const isTabsNeeded =
    profileTypeName === UserType.Admin || profileTypeName === UserType.Teacher;

  const subjectGroupData: SubjectGroupData[] =
    data?.map(
      (group) =>
        (({
          ...group,
          firstButton: t('common:actions.view'),
          tech: '',
        } as SubjectGroupData) || [])
    ) || [];

  const subjectGroupColumns = useMemo(
    () => getSubjectGroupColumns(t, isAdminUserType, isTabsNeeded),
    [t, isAdminUserType, isTabsNeeded]
  );

  return (
    <Page title={t('groups:subjectGroups')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:subjectGroups')}
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
