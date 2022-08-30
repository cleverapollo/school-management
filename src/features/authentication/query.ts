import {gql} from "@apollo/client";

export const QUERY_LAUNCH_LIST = gql`
  query
    myAuthDetails{
    myAuthDetails{
      id
      email,
      name,
      defaultProfileId,
      activeProfileId,
      profiles {
        id

        nickName,
        tenant {
          tenant,
          name,
          imgUrl
        }
        profileType  {
          name,
          description

  }

        permissionIds


      }

    }
  }
`;
