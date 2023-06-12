import { PageHeading, Page, TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';

export default function AttendanceCodesContainer() {
  const { t } = useTranslation(['common', 'attendance']);

  return (
    <Page title={t('attendance:pageTitle.attendance')}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <PageHeading
          title={t('attendance:pageHeading.attendance')}
          breadcrumbs={{
            links: [
              {
                name: t('attendance:attendance'),
                href: './..',
              },
              {
                name: t('attendance:attendanceCodes'),
              },
            ],
          }}
        />
        <TabPageContainer
          links={[
            {
              label: t('attendance:overview'),
              value: 'overview',
            },
            {
              label: t('attendance:attendanceCodes'),
              value: 'attendance-codes',
            },
          ]}
        />
      </Container>
    </Page>
  );
}
