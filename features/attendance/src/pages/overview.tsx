import { useParams } from 'react-router-dom';
import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function Overview() {
  const { t } = useTranslation(['common', 'attendance']);
  const { id } = useParams();
  return (
    <PageContainer title={t('attendance:pageTitle.attendance')}>
      <PageHeading
        titleProps={{ variant: 'h3' }}
        title={t('attendance:pageHeading.attendance')}
      />
      <div>Attendance Page Overview {id}</div>
    </PageContainer>
  );
}
