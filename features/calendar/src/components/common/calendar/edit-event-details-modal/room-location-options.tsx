import { RHFAutocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control, Path, useWatch } from 'react-hook-form';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { FindFreeResourcesFilter, RecurrenceEnum } from '@tyro/api';
import { useGetRoomLocation } from '../../../../api/add-event';
import { ScheduleEventFormState } from './schedule-event';

export type RoomLocationOption = {
  roomId: number;
  name: string;
  type: string;
};

type RoomLocationOptionsProps<TField extends ScheduleEventFormState> = {
  control: Control<TField>;
};

export const RoomLocationOptions = <TField extends ScheduleEventFormState>({
  control,
}: RoomLocationOptionsProps<TField>) => {
  const { t } = useTranslation(['calendar']);

  const {
    startDate,
    startTime,
    endTime,
    recurrenceEnum,
    occurrences,
    endDate,
  } = useWatch({ control });

  const recurrenceFilter = useMemo<
    FindFreeResourcesFilter['recurrence'] | null
  >(() => {
    if (!recurrenceEnum) return null;

    const fromDate = dayjs(startDate as dayjs.Dayjs);
    const startTimeAsDate = dayjs(startTime as dayjs.Dayjs);
    const endTimeAsDate = dayjs(endTime as dayjs.Dayjs);

    const areValidRequiredDates =
      fromDate.isValid() &&
      startTimeAsDate.isValid() &&
      endTimeAsDate.isValid();

    if (!areValidRequiredDates) return null;

    const baseFilters = {
      recurrence: recurrenceEnum,
      fromDate: fromDate.format('YYYY-MM-DD'),
      startTime: startTimeAsDate.format('HH:mm'),
      endTime: endTimeAsDate.format('HH:mm'),
    };

    if (recurrenceEnum === RecurrenceEnum.NoRecurrence) {
      return baseFilters;
    }

    const endsOnDate = dayjs(endDate as dayjs.Dayjs);

    if (endsOnDate.isValid()) {
      return {
        ...baseFilters,
        endDate: endsOnDate.format('YYYY-MM-DD'),
      };
    }

    const endsAfter = Number(occurrences);

    if (endsAfter) {
      return {
        ...baseFilters,
        occurrences: endsAfter,
      };
    }

    return null;
  }, [startDate, startTime, endTime, recurrenceEnum, occurrences, endDate]);

  const { data: freeLocationData } = useGetRoomLocation({
    allRooms: true,
    resources: {},
    recurrence: recurrenceFilter,
  });

  const roomLocationOptions = useMemo<RoomLocationOption[]>(
    () =>
      freeLocationData
        ? [
            ...freeLocationData.freeRooms.map(
              (room) => ({
                ...room,
                type: t('calendar:inputLabels.freeLocation'),
              }),
              ...freeLocationData.clashingRooms.map(({ room }) => ({
                ...room,
                type: t('calendar:inputLabels.clashingLocation'),
              }))
            ),
          ]
        : [],
    [freeLocationData]
  );

  return (
    <RHFAutocomplete<TField, RoomLocationOption>
      label={t('calendar:inputLabels.location')}
      optionIdKey="roomId"
      optionTextKey="name"
      groupBy={(option) => option.type}
      controlProps={{ name: 'location' as Path<TField>, control }}
      options={roomLocationOptions}
    />
  );
};
