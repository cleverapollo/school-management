import { Avatar, Button } from "@mui/material";
import { addEmulationHeaders, getUser, queryClient } from "@tyro/api";
import { Person } from "@tyro/api/src/gql/graphql";
import { Fragment, useMemo } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import Table from '../../../components/table/Table';
import { TableColumn } from '../../../components/table/types';
import useLocales from '../../../hooks/useLocales';
import { useAdminPartyPeopleByTenantId } from "../api/party-people";

interface AdminPanelPeople extends Person {
  name: string;
  tenant: number;
  firstButton: string;
  tech: string;
}

type GetExamplePeopleColumns = (translate: (text: any, options?: any) => never, navigate: NavigateFunction) => TableColumn<AdminPanelPeople>[];

const getExamplePeopleColumns: GetExamplePeopleColumns = (translate, navigate) => ([
  {
    columnDisplayName: translate('name'),
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
    columnDisplayName: translate('type'),
    fieldName: 'type',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('partyId'),
    fieldName: 'partyId',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('tenant'),
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
        { translate('emulate') }
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
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { data, isLoading } = useAdminPartyPeopleByTenantId(Number(schoolId));
  const people = data as AdminPanelPeople[] | undefined;

  const examplePeopleColumns = useMemo(() => getExamplePeopleColumns(translate, navigate), [translate, navigate])

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