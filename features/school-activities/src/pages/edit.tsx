import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer, useToast, useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useCustomGroups } from '@tyro/groups';
import { useSchoolActivityById } from '../api/get-school-activities';
import { useRoomsList } from '../api/get-rooms';
import {
  FormValues,
  SchoolActivityForm,
} from '../components/school-activity-form';

export enum ActivityType {
  MultiDay = 'MULTI_DAY',
  PartialDay = 'PARTIAL_DAY',
  SingleDay = 'SINGLE_DAY',
}

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

    const singleDayDate = dates[0];
    const currentCustomGroup = customGroups?.filter(
      (group) => group?.partyId === customGroupId
    );

    const currentRoomId = location?.roomIds[0];
    const currentRoomData =
      rooms && rooms?.filter((room) => room?.roomId === currentRoomId);
    const roomFormatted = currentRoomData && currentRoomData[0];

    const singleOrMultiDayActivityType =
      dates.length > 1 ? ActivityType.MultiDay : ActivityType.SingleDay;

    return {
      schoolActivityId,
      name,
      group: currentCustomGroup[0],
      details: tripPurpose,
      notes,
      room: roomFormatted,
      dates: dayjs(singleDayDate?.date),
      dateRange: dates?.map((date) => dayjs(date?.date)),
      startTime: dayjs(singleDayDate.startTime, 'HH:mm'),
      endTime: dayjs(singleDayDate.endTime, 'HH:mm'),
      partial: singleDayDate?.partial,
      inSchoolGrounds: location?.inSchoolGrounds,
      requestType: singleDayDate?.partial
        ? ActivityType.PartialDay
        : singleOrMultiDayActivityType,
    } as const;
  }, [schoolActivity]);

  return (
    formValues && (
      <SchoolActivityForm
        schoolActivitiesData={formValues}
        title={t('schoolActivities:editSchoolActivity')}
        onSuccess={() => {
          toast(t('common:snackbarMessages.updateSuccess'));
        }}
        onError={console.error}
      />
    )
  );
}
