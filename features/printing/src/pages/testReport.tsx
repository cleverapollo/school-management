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
  return (
    <PageContainer title={t('printing:timetable.title')}>
      <PageHeading title={t('printing:timetable.title')} />
      <TabPageContainer
        links={[
          {
            label: t('printing:timetable.student'),
            value: 'student',
          },
          {
            label: t('printing:timetable.teachers'),
            value: 'personal',
          },
          {
            label: t('printing:timetable.years'),
            value: 'contacts',
            hasAccess: ({ isStaffUser }) => isStaffUser,
          },
        ]}
      />
    </PageContainer>
  );
}
