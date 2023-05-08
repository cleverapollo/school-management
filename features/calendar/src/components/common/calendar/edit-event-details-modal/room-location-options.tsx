import { RHFAutocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control, Path } from 'react-hook-form';
import { useMemo } from 'react';
import { FindFreeResourcesFilter } from '@tyro/api';
import { useGetRoomLocation } from '../../../../api/add-event';
import { ScheduleEventFormState } from './schedule-event';

export type RoomLocationOption = {
  roomId: number;
  name: string;
  type: string;
};

export type RecurrenceFilter = FindFreeResourcesFilter['recurrence'] | null;

type RoomLocationOptionsProps<TField extends ScheduleEventFormState> = {
  recurrenceFilter: RecurrenceFilter;
  control: Control<TField>;
};

export const RoomLocationOptions = <TField extends ScheduleEventFormState>({
  recurrenceFilter,
  control,
}: RoomLocationOptionsProps<TField>) => {
  const { t } = useTranslation(['calendar']);

  const { data: freeLocationData } = useGetRoomLocation({
    allRooms: true,
    resources: {},
    recurrence: recurrenceFilter,
  });

  const roomLocationOptions = useMemo<RoomLocationOption[]>(
    () =>
      freeLocationData
        ? [
            ...freeLocationData.freeRooms.map((room) => ({
              ...room,
              type: t('calendar:inputLabels.freeLocation'),
            })),
            ...freeLocationData.clashingRooms.map(({ room }) => ({
              ...room,
              type: t('calendar:inputLabels.clashingLocation'),
            })),
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
