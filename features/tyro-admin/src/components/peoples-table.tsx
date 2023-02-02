/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Button } from '@mui/material';
import { addEmulationHeaders, getUser, queryClient } from '@tyro/api';
import { Person } from '@tyro/api/src/gql/graphql';
import { useMemo } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Avatar, useNumber } from '@tyro/core';
import Table from '../../../../src/components/table/Table';
import { TableColumn } from '../../../../src/components/table/types';
import { useAdminPartyPeopleByTenantId } from '../api/party-people';

interface AdminPanelPeople extends Person {
  name: string;
  tenant: number;
  firstButton: string;
  tech: string;
}

type GetExamplePeopleColumns = (
  translate: TFunction<'authentication'[], undefined, 'authentication'[]>,
  navigate: NavigateFunction
) => TableColumn<AdminPanelPeople>[];

const getExamplePeopleColumns: GetExamplePeopleColumns = (
  translate,
  navigate
) => [
  {
    columnDisplayName: translate('authentication:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src="https://google.com"
          name={columnProps.row.original.name}
          style={{ marginRight: '10px' }}
        />
        {columnProps.row.original.name}
      </div>
    ),
  },
  {
    columnDisplayName: translate('authentication:type'),
    fieldName: 'type',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:partyId'),
    fieldName: 'partyId',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:tenant'),
    fieldName: 'tenant',
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: ({ row }) => (
      <Button
        onClick={async () => {
          const { tenant, partyId } = row.original;
          addEmulationHeaders(tenant, partyId);
          queryClient.invalidateQueries();
          await getUser();
          navigate('/', { replace: true });
        }}
      >
        {translate('authentication:emulate')}
      </Button>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
];

export function PeoplesTable() {
  const { schoolId } = useParams();
  const schoolIdAsNumber = useNumber(schoolId);
  const { t } = useTranslation(['authentication']);
  const navigate = useNavigate();
  const { data, isLoading } = useAdminPartyPeopleByTenantId(
    schoolIdAsNumber ?? 0
  );
  const people = data as AdminPanelPeople[] | undefined;

  const examplePeopleColumns = useMemo(
    () => getExamplePeopleColumns(t, navigate),
    [t, navigate]
  );

  if (isLoading) {
    return null;
  }

  return <Table data={people ?? []} columns={examplePeopleColumns} />;
}
