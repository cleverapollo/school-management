import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleKeys } from '../../keys';

const medicalConditionsNames = graphql(/* GraphQL */ `
  query wellbeing_studentMedicalConditionLookup {
    wellbeing_studentMedicalConditionLookup {
      values
    }
  }
`);

const medicalConditionNamesQuery = {
  queryKey: peopleKeys.students.medicalConditions(),
  queryFn: () => gqlClient.request(medicalConditionsNames),
};

export function getMedicalConditionNamesQuery() {
  return queryClient.fetchQuery(medicalConditionNamesQuery);
}

export function useMedicalConditionNamesQuery() {
  return useQuery({
    ...medicalConditionNamesQuery,
    select: ({ wellbeing_studentMedicalConditionLookup }) =>
      wellbeing_studentMedicalConditionLookup,
  });
}
