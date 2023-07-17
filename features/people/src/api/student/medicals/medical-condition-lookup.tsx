import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
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

export type MedicalConditionNamesType = {
  name: string;
  id: string;
};

export function useMedicalConditionNamesQuery() {
  return useQuery({
    ...medicalConditionNamesQuery,
    select: ({ wellbeing_studentMedicalConditionLookup }) => {
      const medicalConditionNamesArray =
        wellbeing_studentMedicalConditionLookup?.values?.reduce((acc, item) => {
          acc.push({
            name: item,
            id: item,
          });

          return acc;
        }, [] as MedicalConditionNamesType[]);

      return medicalConditionNamesArray;
    },
  });
}
