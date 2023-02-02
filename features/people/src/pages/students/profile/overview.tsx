import { useParams } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';

export default function StudentProfileOverviewPage() {
  const { t } = useTranslation(['people']);
  const { id } = useParams();

  return <div>{t('people:studentProfileOverview')} {id}</div>;
}
