import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer, useToast, useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { ParentalAttendanceRequestType } from '@tyro/api';
import { useCustomGroups } from '@tyro/groups';
import { useSchoolActivityById } from '../api/get-school-activities';
import { useRoomsList } from '../api/get-rooms';
import {
  FormValues,
  SchoolActivityForm,
} from '../components/school-activity-form';

// enum ActivityType = {}

export default function EditSchoolActivityPage() {
  const { activityId } = useParams();
  const schoolActivitiesId = useNumber(activityId);

  const { toast } = useToast();
  const { t } = useTranslation(['schoolActivities', 'common']);

  const { data: schoolActivity } = useSchoolActivityById({
    schoolActivityIds: [schoolActivitiesId ?? 0],
  });
  const { data: rooms = [] } = useRoomsList();

  const { data: customGroups = [] } = useCustomGroups();

  const formValues = useMemo<FormValues | null>(() => {
    if (!schoolActivity) return null;

    const {
      schoolActivityId,
      name,
      notes,
      tripPurpose,
      location,
      dates,
      customGroupId,
    } = schoolActivity;

    const datesData = dates[0];
    const currentCustomGroup = customGroups?.filter(
      (group) => group?.partyId === customGroupId
    );

    const currentRoomId = location?.roomIds[0];
    const currentRoomData =
      rooms && rooms?.filter((room) => room?.roomId === currentRoomId);
    const roomFormatted = currentRoomData && currentRoomData[0];

    const activityType = datesData?.partial
      ? ParentalAttendanceRequestType.PartialDay
      : ParentalAttendanceRequestType.SingleDay;

    return {
      schoolActivityId,
      name,
      group: currentCustomGroup[0],
      details: tripPurpose,
      notes,
      room: roomFormatted,
      dates: dayjs(datesData?.date),
      startTime: dayjs(datesData?.startTime),
      endTime: dayjs(datesData?.endTime),
      partial: datesData?.partial,
      inSchoolGrounds: location?.inSchoolGrounds,
      requestType: activityType,
    } as const;
  }, [schoolActivity]);

  return (
    <PageContainer title={t('schoolActivities:editSchoolActivity')}>
      <PageHeading
        title={t('schoolActivities:title')}
        breadcrumbs={{
          links: [
            {
              name: t('schoolActivities:editSchoolActivity'),

              href: '/school-activities',
            },
            {
              name: t('schoolActivities:schoolActivityCreation'),
            },
          ],
        }}
      />
      {formValues && (
        <SchoolActivityForm
          schoolActivitiesData={formValues}
          title={t('schoolActivities:editSchoolActivity')}
          onSuccess={() => {
            toast(t('common:snackbarMessages.updateSuccess'));
          }}
          onError={console.error}
        />
      )}
    </PageContainer>
  );
}
