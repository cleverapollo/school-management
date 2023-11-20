import { PageContainer, PageHeading, TabPageContainer } from '@tyro/core';

import { useParams, Outlet } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';

import { useReportInfo } from '../api/run-report';

export default function ReportContainer() {
  const { t } = useTranslation(['reports']);

  const { id = '' } = useParams();
  const { data: reportData } = useReportInfo({
    topReportId: id,
    filter: {
      reportId: id,
    },
  });

  const reportName = reportData?.info.name || '';
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
