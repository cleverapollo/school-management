import { useEffect } from "react";
import { useNavigate } from 'react-router';
import { apolloClient } from "../../app/api/apollo";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { adminPanelRequest, adminPartyPeopleSuccess, adminTenantsSuccess, adminPanelError } from "../../store/slices/adminPanel";
import { MyAdminPartyPeopleDocument, MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables, MyAdminTenantsDocument, MyAdminTenantsQuery, PartyPerson, Tenant } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { TableColumn, TitleOverride } from '../../components/table/types';
import { Button } from "@mui/material";

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

  const exampleSchoolColumns: TableColumn<AdminPanelTenant>[] = [
    {
      columnDisplayName: 'School',
      fieldName: 'name',
      filter: 'suggest',
      isMandatory: true,
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
        return (<Button onClick={() => {}}>
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
