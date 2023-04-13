import { Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { PageContainer } from '../components/page-container';

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessment']);

  return (
    <PageContainer title={t('assessment:pageTitle.assessments')}>
      <Typography variant="h3" component="h1">
        {t('assessment:pageHeading.assessments')}
      </Typography>
    </PageContainer>
  );
}
