import { Avatar, Button } from "@mui/material";
import { Tenant } from "@tyro/api/src/gql/graphql";
import { Fragment, useMemo } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Table from '../../../components/table/Table';
import { TableColumn } from '../../../components/table/types';
import useLocales from '../../../hooks/useLocales';
import { useAdminTenants } from '../api/tenants';

interface AdminPanelTenant extends Tenant {
  location: string;
  type: string;
  firstButton: string;
  secondButton: string;
  tech: string;
}

type GetExampleSchoolColumns = (translate: (text: any, options?: any) => never, navigate: NavigateFunction) => TableColumn<AdminPanelTenant>[];

const getExampleSchoolColumns: GetExampleSchoolColumns = (translate, navigate) => ([
  {
    columnDisplayName: translate('school'),
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
    columnDisplayName: translate('location'),
    fieldName: 'location',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('type'),
    fieldName: 'type',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('tenant'),
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
        {translate('viewPeople')}
      </Button>)
    }
  },
  {
    columnDisplayName: '',
    fieldName: 'secondButton',
    component: () => {
      return (<Button onClick={() => { }}>
        {translate('emulate')}
      </Button>)
    }
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
]);

export function SchoolsTable() {
  const { translate } = useLocales();
  const { data, isLoading } = useAdminTenants();
  const navigate = useNavigate();
  const tenants = data as AdminPanelTenant[] | undefined;

  const exampleSchoolColumns = useMemo(() => getExampleSchoolColumns(translate, navigate), [translate])

  if (isLoading) {
    return <Fragment />
  }

  return (
    <Table
      title={translate('schools')}
      data={tenants ?? []}
      columns={exampleSchoolColumns}
    />
  );
}