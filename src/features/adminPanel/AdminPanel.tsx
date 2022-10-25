import { useEffect } from "react";
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material';
import { apolloClient } from "../../app/api/apollo";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { adminPanelRequest, adminPartyPeopleSuccess, adminTenantsSuccess, adminPanelError } from "../../store/slices/adminPanel";
import { GlobalUser, MyAdminPartyPeopleDocument, MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables, MyAdminTenantsDocument, MyAdminTenantsQuery, MyAuthDetailsDocument, MyAuthDetailsQuery, PartyPerson, Tenant } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { TableColumn, TitleOverride } from '../../components/table/types';
import { Button } from "@mui/material";
import { authDetailsSuccess } from "../../store/slices/auth";

interface AdminPanelTenant extends Tenant {
  location: string;
  type: string;
  firstButton: string;
  secondButton: string;
  tech: string;
}

interface AdminPanelPeople extends PartyPerson {
  firstButton: string;
  tech: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();

  const exampleSchoolColumns: TableColumn<AdminPanelTenant>[] = [
    {
      columnDisplayName: 'School',
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
      component: (columnProps) => {
        return (<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar srcSet={columnProps.row.original.imgUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }}/>
          {columnProps.row.original.name}
        </div>)
      },
    },
    {
      columnDisplayName: 'Location',
      fieldName: 'location',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Type',
      fieldName: 'type',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Tenant',
      fieldName: 'tenant',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={() => {
          apolloClient.query<MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables>({ query: MyAdminPartyPeopleDocument, variables: { tenant: columnProps.row.original.tenant } })
            .then(res => storeDispatch(adminPartyPeopleSuccess(res.data.admin__party_people.map(person => ({ ...person, tenant: columnProps.row.original.tenant, name: person.firstName + person.lastName })) as PartyPerson[])))
            .catch(e => storeDispatch(adminPanelError()))
        }
        }>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: '',
      fieldName: 'secondButton',
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];

  const examplePeopleColumns: TableColumn<AdminPanelPeople>[] = [
    {
      columnDisplayName: 'Name',
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
      component: (columnProps) => {
        return (<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src="https://google.com" alt={columnProps.row.original.name} style={{ marginRight: '10px' }}/>
          {columnProps.row.original.name}
        </div>)
      },
    },
    {
      columnDisplayName: 'Type',
      fieldName: 'type',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Party Id',
      fieldName: 'partyId',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Tenant',
      fieldName: 'tenant',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={() => {
          localStorage.setItem('X-TENANT-ID', String(columnProps.row.original.tenant));
          localStorage.setItem('X-PARTY-ID', String(columnProps.row.original.partyId));
          apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })
            .then(result => {
              storeDispatch(authDetailsSuccess(result.data.myAuthDetails as GlobalUser));
            }).catch((err: any) => {
              console.log(err);
              navigate('/auth/unauthorized', { replace: true });
            })
        }}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];

  const { tenants, partyPeople } = useTypedSelector((state) => state.adminPanel);
  const schoolsData: AdminPanelTenant[] = tenants?.map(tenant => ({ ...tenant, location: 'Dublin', type: 'IE Secondary', firstButton: 'View People', secondButton: 'Emulate', tech: '' } as AdminPanelTenant )) || [];
  const peopleData: AdminPanelPeople[] = partyPeople?.map(person => ({ ...person, firstButton: 'Emulate', tech: '' })) || [];

  useEffect(() => {
    storeDispatch(adminPanelRequest());
    apolloClient.query<MyAdminTenantsQuery>({ query: MyAdminTenantsDocument })
      .then(res => storeDispatch(adminTenantsSuccess(res.data.admin__tenants)))
      .catch(e => storeDispatch(adminPanelError()))
  }, []);

  return (
    !partyPeople ?
    (
    <Table
      title="Schools"
      data={schoolsData}
      columns={exampleSchoolColumns}
    />
    ) :
    (
    <Table
      title="People"
      data={peopleData}
      columns={examplePeopleColumns}
    />
    )
  )
}

export default AdminPanel;
