import { PageHeading, TabPageContainer, PageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function PrintTimetableContainer() {
  const { t } = useTranslation(['printing']);

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
