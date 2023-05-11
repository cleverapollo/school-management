import { RHFAutocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';
import { useMemo } from 'react';
import { FindFreeResourcesFilter } from '@tyro/api';
import { useRoomLocation } from '../../../../api/add-event';

export type RoomLocationOption = {
  roomId: number;
  name: string;
  type: string;
};

export type RoomLocationFormState = {
  location: Omit<RoomLocationOption, 'type'>;
};

export type RecurrenceFilter = FindFreeResourcesFilter['recurrence'] | null;

type RoomLocationOptionsProps<TField extends RoomLocationFormState> = {
  recurrenceFilter: RecurrenceFilter;
  control: TField extends RoomLocationFormState ? Control<TField> : never;
};

export const RoomLocationOptions = <TField extends RoomLocationFormState>({
  recurrenceFilter,
  control,
}: RoomLocationOptionsProps<TField>) => {
  const { t } = useTranslation(['calendar']);

  const { data: freeLocationData } = useRoomLocation({
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
    <RHFAutocomplete<RoomLocationFormState, RoomLocationOption>
      label={t('calendar:inputLabels.location')}
      optionIdKey="roomId"
      optionTextKey="name"
      groupBy={(option) => option.type}
      controlProps={{ name: 'location', control }}
      options={roomLocationOptions}
    />
  );
};
