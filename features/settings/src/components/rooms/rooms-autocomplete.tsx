import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { useCoreRooms } from '../../api/rooms';

export interface RoomSelect {
  roomId: number;
  name: string;
}

type RHFYearGroupAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, RoomSelect>,
  'options'
>;

type RoomAutocompleteProps = Omit<
  AutocompleteProps<RoomSelect>,
  | 'optionIdKey'
  | 'optionTextKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
>;

export const RHFRoomAutocomplete = <TField extends FieldValues>(
  props: RHFYearGroupAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: roomsData, isLoading } = useCoreRooms();

  const roomOptions = useMemo(
    () =>
      roomsData?.map((r) => ({
        roomId: r.roomId,
        name: r.name,
      })),
    [roomsData]
  );

  // @ts-ignore
  return (
    <RHFAutocomplete<TField, RoomSelect>
      label={t('common:room', { count: 1 })}
      {...props}
      fullWidth
      optionIdKey="roomId"
      optionTextKey="name"
      loading={isLoading}
      options={roomOptions ?? []}
    />
  );
};

export const RoomAutocomplete = (props: RoomAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: roomsData, isLoading } = useCoreRooms();

  const roomOptions = useMemo(
    () =>
      roomsData?.map((r) => ({
        roomId: r.roomId,
        name: r.name,
      })),
    [roomsData]
  );
  // @ts-ignore
  return (
    <Autocomplete
      label={t('common:year')}
      fullWidth
      optionIdKey="roomId"
      optionTextKey="name"
      loading={isLoading}
      options={roomOptions ?? []}
    />
  );
};
