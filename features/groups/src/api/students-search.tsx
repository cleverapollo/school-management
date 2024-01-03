import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context, SearchType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { groupsKeys } from './keys';

const studentsSearch = graphql(/* GraphQL */ `
  query studentsSearchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

export function useStudentsSearch(query: string) {
  const { t } = useTranslation(['common']);
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: groupsKeys.custom.studentsSearch(query),
    queryFn: async () =>
      gqlClient.request(studentsSearch, {
        filter: {
          text: trimmedQuery,
          context: [Context.All],
          includeSearchType: [
            SearchType.Student,
            SearchType.GeneralGroup,
            SearchType.SubjectGroup,
            SearchType.YearGroupEnrollment,
          ],
        },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) =>
      search_search.map((student) => ({
        ...student,
        firstName: student.text,
        caption: student.type ? t(`common:searchType.${student.type}`) : '',
      })),
  });
}
