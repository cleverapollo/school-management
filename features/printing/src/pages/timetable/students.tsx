import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  PageHeading,
  TabPageContainer,
  PageContainer,
  PreferredNameFormat,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function StudentProfileContainer() {
  const { t } = useTranslation(['printing']);

  const { id } = useParams();
  return <div>hello</div>;
}
