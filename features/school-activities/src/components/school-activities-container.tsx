import { Box, Button } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

import {
  PageHeading,
  PageContainer,
  RouterLink,
  TabPageContainer,
  useNumber,
} from '@tyro/core';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
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
                value: 'requests',
                label: t('schoolActivities:requests'),
              },
              {
                value: 'approval',
                label: t('schoolActivities:approval'),
              },
              {
                value: 'fees',
                label: t('schoolActivities:fees'),
              },
              {
                value: 'effected-classes',
                label: t('schoolActivities:effectedClasses'),
              },
              {
                value: 'publish',
                label: t('schoolActivities:publish'),
              },
              {
                value: 'notes',
                label: t('schoolActivities:notes'),
              },
              {
                value: 'medical',
                label: t('schoolActivities:medical'),
              },
            ]}
          />
        </>
      )}
    </PageContainer>
  );
}
