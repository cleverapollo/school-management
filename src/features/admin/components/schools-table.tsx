import { Avatar, Button } from "@mui/material";
import { Tenant } from "@tyro/api/src/gql/graphql";
import { Fragment, useMemo } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Table from '../../../components/table/Table';
import { TableColumn } from '../../../components/table/types';
import { useTranslation } from '@tyro/i18n';
import { useAdminTenants } from '../api/tenants';
import { TFunction } from 'i18next';

interface AdminPanelTenant extends Tenant {
  location: string;
  type: string;
  firstButton: string;
  secondButton: string;
  tech: string;
}

type GetExampleSchoolColumns = (translate: TFunction, navigate: NavigateFunction) => TableColumn<AdminPanelTenant>[];

const getExampleSchoolColumns: GetExampleSchoolColumns = (translate, navigate) => ([
  {
    columnDisplayName: translate('authentication:school'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar srcSet={columnProps.row.original.imgUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }} />
          {columnProps.row.original.name}
        </div>
      )
    },
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
    component: ({ row }) => {
      return (<Button onClick={() => {
        navigate(`./${row.original.tenant}/people`);
      }
      }>
        {translate('authentication:viewPeople')}
      </Button>)
    }
  },
  {
    columnDisplayName: '',
    fieldName: 'secondButton',
    component: () => {
      return (<Button onClick={() => { }}>
        {translate('authentication:emulate')}
      </Button>)
    }
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
]);

export function SchoolsTable() {
  const { t } = useTranslation(['authentication']);
  const { data, isLoading } = useAdminTenants();
  const navigate = useNavigate();
  const tenants = data as AdminPanelTenant[] | undefined;

  const exampleSchoolColumns = useMemo(() => getExampleSchoolColumns(t, navigate), [t, navigate])

  if (isLoading) {
    return <Fragment />
  }

  return (
    <Table
      data={tenants ?? []}
      columns={exampleSchoolColumns}
    />
  );
}