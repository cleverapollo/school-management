/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button } from '@mui/material';
import { Avatar } from '@tyro/core';
import { Tenant } from '@tyro/api/src/gql/graphql';
import { useMemo } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useTranslation, TFunction } from '@tyro/i18n';
import Table from '../../../../src/components/table/Table';
import { TableColumn } from '../../../../src/components/table/types';
import { useAdminTenants } from '../api/tenants';

interface AdminPanelTenant extends Tenant {
  location: string;
  type: string;
  firstButton: string;
  secondButton: string;
  tech: string;
}

type GetExampleSchoolColumns = (
  translate: TFunction<'authentication'[], undefined, 'authentication'[]>,
  navigate: NavigateFunction
) => TableColumn<AdminPanelTenant>[];

const getExampleSchoolColumns: GetExampleSchoolColumns = (
  translate,
  navigate
) => [
  {
    columnDisplayName: translate('authentication:school'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={columnProps.row.original.imgUrl ?? undefined}
          name={columnProps.row.original.name}
          style={{ marginRight: '10px' }}
        />
        {columnProps.row.original.name}
      </div>
    ),
  },
  {
    columnDisplayName: translate('authentication:location'),
    fieldName: 'location',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:type'),
    fieldName: 'type',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:tenant'),
    fieldName: 'tenant',
    filter: 'suggest',
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: ({ row }) => (
      <Button
        onClick={() => {
          navigate(`./${row.original.tenant}/people`);
        }}
      >
        {translate('authentication:viewPeople')}
      </Button>
    ),
  },
  {
    columnDisplayName: '',
    fieldName: 'secondButton',
    component: () => (
      <Button onClick={() => {}}>{translate('authentication:emulate')}</Button>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
];

export function SchoolsTable() {
  const { t } = useTranslation(['authentication']);
  const { data, isLoading } = useAdminTenants();
  const navigate = useNavigate();
  const tenants = data as AdminPanelTenant[] | undefined;

  const exampleSchoolColumns = useMemo(
    () => getExampleSchoolColumns(t, navigate),
    [t, navigate]
  );

  if (isLoading) {
    return null;
  }

  return <Table data={tenants ?? []} columns={exampleSchoolColumns} />;
}
