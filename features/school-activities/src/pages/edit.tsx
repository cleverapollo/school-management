import { useTranslation } from '@tyro/i18n';
import { useToast, useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useCustomGroups } from '@tyro/groups';
import { useStaffWorkAbsenceTypes } from '@tyro/substitution';
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

  const { data: absenceTypesData } = useStaffWorkAbsenceTypes({});

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
      staffAbsenceTypeId,
    } = schoolActivity;

    const singleDayDate = dates == null ? null : dates[0];
    const currentCustomGroup = customGroups?.filter(
      (group) => group?.partyId === customGroupId
    );

    const currentRoomData =
      rooms && rooms?.filter((room) => room?.roomId === location?.roomIds[0]);
    const roomFormatted = currentRoomData && currentRoomData[0];

    const singleOrMultiDayActivityType =
      dates.length > 1 ? ActivityType.MultiDay : ActivityType.SingleDay;

    let dateRange;
    if (singleOrMultiDayActivityType === ActivityType.MultiDay) {
      const startDate = dayjs(dates[0].date);
      const endDate = dayjs(dates[dates.length - 1].date);
      dateRange = [startDate, endDate];
    }

    const currentAbsenceType = absenceTypesData?.find(
      (absenceType) => absenceType?.absenceTypeId === staffAbsenceTypeId
    );

    return {
      schoolActivityId,
      name,
      group: currentCustomGroup[0],
      details: tripPurpose,
      notes,
      room: roomFormatted,
      dates: dayjs(singleDayDate?.date),
      dateRange,
      startTime: dayjs(singleDayDate?.startTime, 'HH:mm'),
      endTime: dayjs(singleDayDate?.endTime, 'HH:mm'),
      partial: singleDayDate?.partial,
      inSchoolGrounds: location?.inSchoolGrounds,
      locationDetails: location?.locationDetails,
      requestType: singleDayDate?.partial
        ? ActivityType.PartialDay
        : singleOrMultiDayActivityType,
      absenceType: currentAbsenceType,
      absenceTypeId: staffAbsenceTypeId,
    } as const;
  }, [schoolActivity, rooms, customGroups]);

  return (
    formValues &&
    formValues?.group && (
      <SchoolActivityForm
        schoolActivitiesData={formValues}
        title={t('schoolActivities:editActivityDetails')}
        onSuccess={() => {
          toast(t('common:snackbarMessages.updateSuccess'));
        }}
        onError={console.error}
      />
    )
  );
}
