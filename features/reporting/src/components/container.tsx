import { PageContainer, PageHeading, TabPageContainer } from '@tyro/core';

import { useParams, Outlet } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';

import { useRunReports } from '../api/run-report';
import { getAwolReportsInfo } from '../utils/get-awol-report-data';

export default function ReportContainer() {
  const { t } = useTranslation(['reports']);

  const { id = '' } = useParams();
  const { data: reportData } = useRunReports({
    topReportId: id,
    filter: {
      reportId: id,
    },
  });

  const awolReportsData = getAwolReportsInfo(t);

  const awolReportName = awolReportsData?.info?.name;
  const reportName = (reportData?.info.name ?? awolReportName) || '';
  const reports = reportData?.innerReports || [];

  return (
    <PageContainer title={reportName}>
      <PageHeading
        title={reportName}
        breadcrumbs={{
          links: [
            {
              name: t('reports:list'),
              href: './..',
            },
            {
              name: reportName,
            },
          ],
        }}
      />
      {reports.length > 1 ? (
        <TabPageContainer
          links={reports.map((report) => ({
            label: report.name,
            value: report.id,
          }))}
        />
      ) : (
        <Outlet />
      )}
    </PageContainer>
  );
}
