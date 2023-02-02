/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import {
  GeneralGroup,
  GeneralGroupType,
  Group,
  UserType,
  useUser,
} from '@tyro/api';
import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Page } from '@tyro/core';
import Table from '../../../../../src/components/table/Table';
import { Option, TableColumn } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';
import { ColoredBox } from '../../components/ColoredBox';
import { useCustomGroups } from '../../api/general-groups';

interface CustomGroupData {
  name: GeneralGroup['name'];
  members: Group['memberCount'];
  type:
    | GeneralGroupType.StaticGroup
    | GeneralGroupType.DynamicGroup
    | undefined;
  created: string;
  id: string;
  firstButton?: string;
  tech?: string;
}

export const getAdminOptions = (
  translate: TFunction<('common')[], undefined, ('common')[]>,
): Option<CustomGroupData>[] => ([
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

// export const adminOptions: Option<CustomGroupData>[] = [
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

const getCustomGroupColumns = (
  translate: TFunction<('common' | 'groups')[], undefined, ('common' | 'groups')[]>,
  isAdminUserType: boolean
): TableColumn<CustomGroupData>[] => [
  {
    columnDisplayName: 'id',
    fieldName: 'id',
  },
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('groups:members'),
    fieldName: 'members',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('common:type'),
    fieldName: 'type',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => (
      <ColoredBox content={columnProps.row.original.type} />
    ),
  },
  {
    columnDisplayName: translate('groups:created'),
    fieldName: 'created',
    filter: 'suggest',
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
    component: (columnProps) =>
      isAdminUserType && <OptionButton options={getAdminOptions(translate)} />,
  },
];

const getStudentsCustomGroupColumns = (
  translate: (text: any, options?: any) => string
): TableColumn<CustomGroupData>[] => [
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
  },
];

export default function CustomGroups() {
  const { t } = useTranslation(['common', 'groups']);
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useCustomGroups();
  const profileTypeName = activeProfile?.profileType?.name;
  const isAdminUserType = profileTypeName === UserType.Admin;
  const isFacultyOrAdmin =
    profileTypeName === UserType.Admin || profileTypeName === UserType.Teacher;

  const customGroupData: CustomGroupData[] =
    data?.map(
      (group) =>
        ({
          ...group,
          firstButton: t('common:actions.view'),
          tech: '',
        } as CustomGroupData)
    ) ?? [];

  const customGroupColumns = useMemo(
    () =>
      isFacultyOrAdmin
        ? getCustomGroupColumns(t, isAdminUserType)
        : getStudentsCustomGroupColumns(t),
    [t, isAdminUserType, isFacultyOrAdmin]
  );

  return (
    <Page title={t('groups:customGroups')} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:customGroups')}
        </Typography>
        <Table
          data={customGroupData}
          columns={customGroupColumns}
          // ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id: string) => {
            navigate(`./${id}/view`);
          }}
        />
      </Container>
    </Page>
  );
}
