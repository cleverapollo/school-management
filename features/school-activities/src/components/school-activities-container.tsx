import { useTranslation } from '@tyro/i18n';
import {
  PageHeading,
  PageContainer,
  TabPageContainer,
  useNumber,
} from '@tyro/core';
import { useParams } from 'react-router-dom';
import { SchoolActivityStatusBar } from './school-activity-status-bar';
import { useSchoolActivityById } from '../api/get-school-activities';

export default function SchoolActivitiesContainer() {
  const { t } = useTranslation(['schoolActivities', 'common', 'groups']);
  const { activityId } = useParams();
  const schoolActivitiesId = useNumber(activityId);

  const { data: schoolActivity, isLoading } = useSchoolActivityById({
    schoolActivityIds: [schoolActivitiesId ?? 0],
  });

  return (
    <PageContainer title={t('schoolActivities:schoolActivitiesTitle')}>
      <PageHeading
        title={t('schoolActivities:schoolActivitiesTitle')}
        titleProps={{ variant: 'h3' }}
        breadcrumbs={{
          links: [
            {
              name: t('schoolActivities:schoolActivitiesTitle'),
              href: './../',
            },
            {
              name: t('schoolActivities:overview'),
            },
          ],
        }}
      />
      {!isLoading && schoolActivity && (
        <>
          <SchoolActivityStatusBar schoolActivity={schoolActivity} />
          <TabPageContainer
            links={[
              {
                value: 'cover-required',
                label: t('schoolActivities:coverRequired'),
              },
              {
                value: 'class-away',
                label: t('schoolActivities:classAway'),
              },
            ]}
          />
        </>
      )}
    </PageContainer>
  );
}
