/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { GeneralGroup, Group, UserType, useUser } from '@tyro/api';
import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Page } from '@tyro/core';
import Table from '../../../../../src/components/table/Table';
import { Option, TableColumn } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';
import { useEnrolmentGroups } from '../../api/general-groups';

interface EnrolmentGroupData {
  name: GeneralGroup['name'];
  members: Group['memberCount'];
  programme: string | null | undefined;
  year: string;
  tutor: string;
  yearhead: string;
  id: string;
  firstButton?: string;
  tech?: string;
}

export const adminOptions: Option<EnrolmentGroupData>[] = [
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

const getEnrolmentGroupColumns = (
  translate: TFunction<
    ('common' | 'authentication')[],
    undefined,
    ('common' | 'authentication')[]
  >,
  isAdminUserType: boolean
): TableColumn<EnrolmentGroupData>[] => [
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
    columnDisplayName: translate('common:members'),
    fieldName: 'members',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('authentication:year'),
    fieldName: 'year',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('authentication:tutor'),
    fieldName: 'tutor',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:yearhead'),
    fieldName: 'yearhead',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:programme'),
    fieldName: 'programme',
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

export default function EnrolmentGroups() {
  const { t } = useTranslation(['common', 'authentication']);
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useEnrolmentGroups();
  const profileTypeName = activeProfile?.profileType?.userType;
  const isAdminUserType = profileTypeName === UserType.Admin;

  const enrolmentGroupColumns = useMemo(
    () => getEnrolmentGroupColumns(t, isAdminUserType),
    [t, isAdminUserType]
  );

  const enrolmentGroupData: EnrolmentGroupData[] =
    data?.map(
      (group) =>
        (({
          ...group,
          firstButton: isAdminUserType
            ? t('authentication:view')
            : t('authentication:notify'),
          tech: '',
        } as EnrolmentGroupData) || [])
    ) || [];

  return (
    <Page title="Enrolment groups" isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Enrolment groups
        </Typography>
        <Table
          data={enrolmentGroupData}
          columns={enrolmentGroupColumns}
          // ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id: string) => {
            navigate(`./${id}/view`);
          }}
        />
      </Container>
    </Page>
  );
}
