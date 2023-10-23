import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@tyro/i18n';
import { reportsKeys } from './keys';

const reportsList = graphql(/* GraphQL */ `
  query reporting_reports {
    reporting_reports {
      info {
        id
        name
      }
      reports {
        id
        name
      }
    }
  }
`);

const reportsListQuery = () => ({
  queryKey: reportsKeys.all,
  queryFn: async () => gqlClient.request(reportsList, {}),
});

export function getReportsList() {
  return queryClient.fetchQuery(reportsListQuery());
}

export function useReportsList() {
  const { t } = useTranslation(['reports']);

  return useQuery({
    ...reportsListQuery(),
    select: ({ reporting_reports }) => [
      ...reporting_reports.map((report) => ({
        ...report,
        url: `${report.info.id}/${report?.reports?.[0]?.id}`,
      })),
      {
        info: { id: 'awol-students', name: t('reports:awolStudents') },
        reports: [{ id: 'awol-students', name: t('reports:awolStudents') }],
        url: 'awol-students',
      },
    ],
  });
}

export type ReturnTypeFromUseReportsList = UseQueryReturnType<
  typeof useReportsList
>[number];
