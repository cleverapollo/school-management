import { Avatar, Button } from "@mui/material";
import { addEmulationHeaders, getUser } from "@tyro/api";
import { Person } from "@tyro/api/src/gql/graphql";
import { Fragment, useMemo } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import Table from '../../../components/table/Table';
import { TableColumn } from '../../../components/table/types';
import { useTranslation } from '@tyro/i18n';
import { useAdminPartyPeopleByTenantId } from "../api/party-people";
import { TFunction } from 'i18next';

interface AdminPanelPeople extends Person {
  name: string;
  tenant: number;
  firstButton: string;
  tech: string;
}

type GetExamplePeopleColumns = (translate: TFunction, navigate: NavigateFunction) => TableColumn<AdminPanelPeople>[];

const getExamplePeopleColumns: GetExamplePeopleColumns = (translate, navigate) => ([
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => {
      return (<div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src="https://google.com" alt={columnProps.row.original.name} style={{ marginRight: '10px' }} />
        {columnProps.row.original.name}
      </div>)
    },
  },
  {
    columnDisplayName: translate('common:type'),
    fieldName: 'type',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('common:partyId'),
    fieldName: 'partyId',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('common:tenant'),
    fieldName: 'tenant',
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: ({ row }) => {
      return (<Button onClick={async () => {
        const { tenant, partyId } = row.original;
        addEmulationHeaders(tenant, partyId);
        await getUser();
        navigate('/', { replace: true });
      }}>
        { translate('common:emulate') }
      </Button>)
    }
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
]);

export function PeoplesTable() {
  const { schoolId } = useParams();
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { data, isLoading } = useAdminPartyPeopleByTenantId(Number(schoolId));
  const people = data as AdminPanelPeople[] | undefined;

  const examplePeopleColumns = useMemo(() => getExamplePeopleColumns(t, navigate), [t, navigate])

  if (isLoading) {
    return <Fragment />
  }

  return (
    <Table
      data={people ?? []}
      columns={examplePeopleColumns}
    />
  );
}