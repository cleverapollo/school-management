import { useMemo } from 'react';
import { RHFAutocomplete, RHFAutocompleteProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { FieldValues } from 'react-hook-form';
import { ReturnTypeFromUseCoverLookup } from '../../../api/staff-work-cover-lookup';

export type ApplyCoverRoomOption = (
  | ReturnTypeFromUseCoverLookup['freeRooms'][number]
  | ReturnTypeFromUseCoverLookup['clashingRooms'][number]['room']
) & { group: string };

type RoomsAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, ApplyCoverRoomOption>,
  'options'
> & {
  data: ReturnTypeFromUseCoverLookup | undefined;
};

export const RoomsAutocomplete = <TField extends FieldValues>({
  data,
  ...props
}: RoomsAutocompleteProps<TField>) => {
  const { t } = useTranslation(['common', 'substitution']);

  const rooms = useMemo(() => {
    if (!data) return [];

    return [
      ...data.freeRooms.map((room) => ({
        ...room,
        group: t('substitution:freeRooms'),
      })),
      ...data.clashingRooms.map(({ room }) => ({
        ...room,
        group: t('substitution:clashingRooms'),
      })),
    ];
  }, [data, t]);

  return (
    <RHFAutocomplete
      label={t('substitution:changeRoom')}
      options={rooms}
      groupBy={(option) => option.group}
      optionIdKey="roomId"
      optionTextKey="name"
      fullWidth
      {...props}
    />
  );
};
