/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { UserType, useUser } from '@tyro/api';
import { useMemo } from 'react';
import Table from '../../../../../src/components/table/Table';
import { Option, TableColumn } from '../../../../../src/components/table/types';
import useLocales from '../../../../../src/hooks/useLocales';
import OptionButton from '../../../../../src/components/table/OptionButton';
import { CustomGroup } from '../../../../../src/app/api/generated';
import Page from '../../../../../src/components/Page';
import useSettings from '../../../../../src/hooks/useSettings';
import { ColoredBox } from '../../components/ColoredBox';
import { useCustomGroups } from '../../api/general-groups';

interface CustomGroupData extends Omit<CustomGroup, 'members'> {
  members: number;
  firstButton?: string;
  tech?: string;
}

export const adminOptions: Option<CustomGroupData>[] = [
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

const getCustomGroupColumns = (
  translate: (text: any, options?: any) => string,
  isAdminUserType: boolean
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
    component: (columnProps) => (
      <ColoredBox content={columnProps.row.original.type} />
    ),
  },
  {
    columnDisplayName: translate('created'),
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
      isAdminUserType && <OptionButton options={adminOptions} />,
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
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
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
          firstButton: translate('view'),
          tech: '',
        } as CustomGroupData)
    ) ?? [];

  const customGroupColumns = useMemo(
    () =>
      isFacultyOrAdmin
        ? getCustomGroupColumns(translate, isAdminUserType)
        : getStudentsCustomGroupColumns(translate),
    [translate, isAdminUserType, isFacultyOrAdmin]
  );

  return (
    <Page title="Custom groups" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Custom groups
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
