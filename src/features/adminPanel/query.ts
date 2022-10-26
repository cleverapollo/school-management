import { gql } from "@apollo/client";

export const QUERY_ADMIN_TENANTS = gql`
  query
    admin_tenants{
      admin_tenants{
        tenant
        name
        imgUrl
      }
    }
`;

export const QUERY_ADMIN_PARTY_PEOPLE = gql`
  query
    admin_party_people{
      admin_party_people(tenant: !Number){
        partyId
        firstName
        lastName
        type
      }
    }
`;