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

export default function PrintTimetableContainer() {
  const { t } = useTranslation(['printing']);

  const { id } = useParams();
  return (
    <PageContainer title={t('printing:timetable.title')}>
      <PageHeading title={t('printing:timetable.title')} />
      <TabPageContainer
        links={[
          {
            label: t('printing:timetable.student'),
            value: 'students',
          },
          {
            label: t('printing:timetable.teachers'),
            value: 'staff',
          },
          {
            label: t('printing:timetable.years'),
            value: 'years',
          },
          {
            label: t('printing:timetable.class'),
            value: 'class',
          },
          {
            label: t('printing:timetable.rooms'),
            value: 'rooms',
          },
        ]}
      />
    </PageContainer>
  );
}
