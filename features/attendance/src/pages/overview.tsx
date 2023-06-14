import { useParams } from 'react-router-dom';
import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function Overview() {
  const { t } = useTranslation(['common', 'attendance']);
  const { id } = useParams();
  return (
    <PageContainer
      title={t('attendance:pageTitle.attendance')}
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
              name: t('common:overview'),
            },
          ],
        }}
      />
      <div>Attendance Page Overview {id}</div>
    </PageContainer>
  );
}
