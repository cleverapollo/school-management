import { useTranslation } from '@tyro/i18n';
import { Autocomplete } from '@tyro/core';
import { useEffect } from 'react';
import { SxProps, Theme, Typography, Box } from '@mui/material';
import { ReturnTypeOfUseBlockList, useBlocksList } from '../../api/blocks';

type BlockAutocompleteValue = NonNullable<ReturnTypeOfUseBlockList>[number];

export type BlockAutocompleteProps = {
  value: BlockAutocompleteValue | null;
  yearGroupId: number | undefined;
  onChange: (block: BlockAutocompleteValue | null) => void;
  sx?: SxProps<Theme> | undefined;
};

export const BlockAutocomplete = ({
  value,
  yearGroupId,
  onChange,
  sx,
}: BlockAutocompleteProps) => {
  const { t } = useTranslation(['classListManager']);
  const { data: options = [] } = useBlocksList(yearGroupId ?? 0);

  useEffect(() => {
    if (!value && options.length) {
      onChange(options[0]);
    }
  }, [options]);

  return (
    <Autocomplete
      label={t('classListManager:block')}
      value={value}
      options={options}
      optionIdKey="blockId"
      getOptionLabel={({ blockId, subjectGroupNamesJoined }) =>
        subjectGroupNamesJoined
          ? `${blockId}: ${subjectGroupNamesJoined}`
          : blockId
      }
      onChange={(_event, newValue) => {
        const extractedValue = Array.isArray(newValue) ? newValue[0] : newValue;
        onChange(extractedValue);
      }}
      inputProps={{
        variant: 'white-filled',
      }}
      sx={sx}
      componentsProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            width: 'auto !important',
            maxWidth: 'calc(100vw - 32px)',
          },
        },
      }}
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
