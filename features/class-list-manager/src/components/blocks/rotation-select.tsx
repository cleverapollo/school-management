import { SxProps, Theme } from '@mui/material';
import { Select } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { BlockAutocompleteProps } from './block-autocomplete';

interface RotationSelectProps {
  onChange: (rotationIndex: number) => void;
  value: number | string;
  rotations: NonNullable<BlockAutocompleteProps['value']>['rotations'];
  sx?: SxProps<Theme> | undefined;
}

export function RotationSelect({
  onChange,
  value,
  rotations,
  sx,
}: RotationSelectProps) {
  const { t } = useTranslation(['classListManager']);

  const options = useMemo(
    () =>
      rotations.map(({ iteration }, index) => ({
        iteration,
        index,
      })),
    [rotations]
  );

  return (
    <Select
      label={t('classListManager:rotation')}
      variant="white-filled"
      value={value}
      onChange={(event) => {
        onChange(Number(event.target.value));
      }}
      optionIdKey="index"
      getOptionLabel={({ iteration }) =>
        t('classListManager:rotationX', { number: iteration })
      }
      options={options}
      sx={sx}
    />
  );
}
