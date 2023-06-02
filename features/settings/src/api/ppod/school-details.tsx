import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { ppodSyncKeys } from './keys';

const schoolsInfo = graphql(/* GraphQL */ `
  query users_schoolInfo {
    users_schoolInfo {
      id
      rollNo
      name
      email
      website
      fax
      principal
      boardingFeeFiveDay
      boardingFeeSixOrSevenDay
      schoolGender
      parentAssociation
      studentCouncil
      boardOfManagement
      irishClassification
      coOperatingSchoolRollNo1
      coOperatingSchoolRollNo2
      octoberReturnsContact
      octoberReturnsPhoneNo
      octoberReturnsFaxNo
      octoberReturnsEmail
      phones {
        phone
      }
      addresses {
        address1
        address2
        address3
        address4
        county
        localAuthority
      }
      chairPeople {
        chairPersonId
        forename
        surname
        phoneNo
        startDate
        endDate
      }
      owners {
        ownerId
        forename
        surname
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        startDate
        endDate
      }
      trustees {
        trusteeId
        forename
        surname
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        startDate
        endDate
      }
    }
  }
`);

const schoolsInfoQuery = {
  queryKey: ppodSyncKeys.schoolsInfo(),
  queryFn: async () => gqlClient.request(schoolsInfo),
};

export function getSchoolsInfo() {
  return queryClient.fetchQuery(schoolsInfoQuery);
}

export function useSchoolsInfo() {
  return useQuery({
    ...schoolsInfoQuery,
    select: ({ users_schoolInfo }) => users_schoolInfo,
  });
}

export type ReturnTypeFromUseSchoolsInfo = UseQueryReturnType<
  typeof useSchoolsInfo
>;
