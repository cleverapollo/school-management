import { useEffect } from "react";
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material';
import { apolloClient } from "../../app/api/apollo";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { adminPanelRequest, fetchTenants, fetchPartyPeople, resetAdminPanelState } from "../../store/slices/adminPanel";
import { GlobalUser, MyAdminPartyPeopleDocument, MyAdminPartyPeopleQuery, MyAdminPartyPeopleQueryVariables, MyAdminTenantsDocument, MyAdminTenantsQuery, MyAuthDetailsDocument, MyAuthDetailsQuery, PartyPerson, Tenant } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { TableColumn, TitleOverride } from '../../components/table/types';
import { Button } from "@mui/material";
import { authDetailsSuccess } from "../../store/slices/auth";
import { addEmulationHeaders } from "../../utils/emulateUser";

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
          storeDispatch(adminPanelRequest());
          storeDispatch(fetchPartyPeople(columnProps.row.original.tenant));
        }
        }>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: '',
      fieldName: 'secondButton',
      component: (columnProps) => {
        return (<Button onClick={() => {}}>
          {columnProps.row.original.secondButton}
        </Button>)
      }
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
          addEmulationHeaders(columnProps.row.original.tenant, columnProps.row.original.partyId);
          apolloClient.query<MyAuthDetailsQuery>({ query: MyAuthDetailsDocument })
            .then(result => {
              storeDispatch(authDetailsSuccess(result.data.myAuthDetails as GlobalUser));
              storeDispatch(resetAdminPanelState());
            }).catch((err: any) => {
              console.log(err);
            })
          navigate('/', { replace: true });
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
  const schoolsData: AdminPanelTenant[] = tenants?.map(tenant => (
    { ...tenant, 
      location: 'Dublin', 
      type: 'IE Secondary', 
      firstButton: 'View People', 
      secondButton: 'Emulate', 
      tech: '' } as AdminPanelTenant )) || [];
  const peopleData: AdminPanelPeople[] = partyPeople?.map(person => ({ ...person, firstButton: 'Emulate', tech: '' })) || [];

  useEffect(() => {
    storeDispatch(adminPanelRequest());
    storeDispatch(fetchTenants());
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
