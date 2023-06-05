import { useTranslation } from '@tyro/i18n';
import { Autocomplete } from '@tyro/core';
import { useMemo } from 'react';
import { SxProps, Theme, Typography, Box } from '@mui/material';
import { ReturnTypeOfUseBlockList, useBlocksList } from '../../api/blocks';

type BlockAutocompleteValue = NonNullable<ReturnTypeOfUseBlockList>[number];

export type BlockAutocompleteProps = {
  value: BlockAutocompleteValue | null;
  onChange: (block: BlockAutocompleteValue | null) => void;
  sx?: SxProps<Theme> | undefined;
};

export const BlockAutocomplete = ({
  value,
  onChange,
  sx,
}: BlockAutocompleteProps) => {
  const { t } = useTranslation(['classListManager']);
  const { data: blocks } = useBlocksList();

  const options = useMemo(
    () =>
      blocks?.sort(
        (prev, next) => prev.blockId.localeCompare(next.blockId) ?? 0
      ) ?? [],
    [blocks]
  );

  return (
    <Autocomplete
      label={t('classListManager:block')}
      value={value}
      multiple={false}
      options={options}
      isOptionEqualToValue={(option, { blockId }) => option.blockId === blockId}
      getOptionLabel={({ blockId, subjectGroupNamesJoined }) =>
        subjectGroupNamesJoined
          ? `${blockId}: ${subjectGroupNamesJoined}`
          : blockId
      }
      onChange={(event, newValue) => {
        const extractedValue = Array.isArray(newValue) ? newValue[0] : newValue;
        onChange(extractedValue);
      }}
      inputProps={{
        variant: 'white-filled',
      }}
      sx={sx}
      renderOption={(optionProps, { blockId, subjectGroupNamesJoined }) => (
        <Box component="li" {...optionProps}>
          <Typography noWrap component="span" variant="subtitle2">
            <Typography component="span" variant="subtitle2">
              {blockId}
            </Typography>
            {subjectGroupNamesJoined && (
              <Typography component="span" variant="body2">
                {`: ${subjectGroupNamesJoined}`}
              </Typography>
            )}
          </Typography>
        </Box>
      )}
    />
  );
};
