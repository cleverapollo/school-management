import { Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessment']);

  return (
    <Typography variant="h3" component="h1">
      {t('assessment:title')}
    </Typography>
  );
}
