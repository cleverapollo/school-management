import { useTranslation } from '@tyro/i18n';
import { Autocomplete } from '@tyro/core';
import { useMemo } from 'react';
import { SxProps, Theme, useTheme } from '@mui/material';
import { useBlocksList } from '../../api/blocks';

type BlockAutocompleteProps = {
  value: string | null;
  onChange: (blockId: string | null) => void;
  sx?: SxProps<Theme> | undefined;
};

export const BlockAutocomplete = ({
  value,
  onChange,
  sx,
}: BlockAutocompleteProps) => {
  const { t } = useTranslation(['classListManager']);
  const { data: blocks } = useBlocksList();

  const { spacing } = useTheme();
  const MAX_WIDTH = spacing(54);

  const options = useMemo(
    () =>
      blocks
        ?.map(({ blockId }) => blockId)
        .sort((prev, next) => prev.localeCompare(next) ?? 0) ?? [],
    [blocks]
  );

  return (
    <Autocomplete
      label={t('classListManager:block')}
      value={value}
      multiple={false}
      options={options}
      onChange={(event, newValue) => {
        if (Array.isArray(newValue)) {
          onChange(newValue[0]);
        } else {
          onChange(newValue);
        }
      }}
      inputProps={{
        variant: 'white-filled',
      }}
      sx={{ maxWidth: MAX_WIDTH, ...sx }}
    />
  );
};
