import { useTranslation } from '@tyro/i18n';
import { Autocomplete } from '@tyro/core';
import { useEffect, useMemo } from 'react';
import { SxProps, Theme, Typography, Box } from '@mui/material';
import { useOptionsSolutions } from '../../api/options-solutions';

export type OptionsBlockAutocompleteValue = {
  blockIdx: number;
  subjectGroupNamesJoined: string;
};

export type OptionsBlockAutocompleteProps = {
  value: OptionsBlockAutocompleteValue | null;
  optionId: number | undefined;
  onChange: (block: OptionsBlockAutocompleteValue | null) => void;
  sx?: SxProps<Theme> | undefined;
};

export const OptionsBlockAutocomplete = ({
  value,
  optionId,
  onChange,
  sx,
}: OptionsBlockAutocompleteProps) => {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const { data } = useOptionsSolutions({ optionId: optionId ?? 0 });

  const options = useMemo(() => {
    if (!data) return [];

    return data.pools.reduce<OptionsBlockAutocompleteValue[]>((acc, pool) => {
      pool.blocks.forEach(({ blockIdx, subjectGroups }) => {
        acc.push({
          blockIdx,
          subjectGroupNamesJoined: subjectGroups
            .map((subjectGroup) => subjectGroup.name)
            .join(', '),
        });
      });
      return acc;
    }, []);
  }, [data, t]);

  useEffect(() => {
    if (!value && options.length) {
      onChange(options[0]);
    }
  }, [options]);

  return (
    <Autocomplete
      label={t('common:block')}
      value={value}
      options={options}
      optionIdKey="blockIdx"
      getOptionLabel={({ blockIdx, subjectGroupNamesJoined }) => {
        const blockName = t('subjectOptions:blockN', { number: blockIdx + 1 });
        return subjectGroupNamesJoined
          ? `${blockName}: ${subjectGroupNamesJoined}`
          : blockName;
      }}
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
      renderOption={(optionProps, { blockIdx, subjectGroupNamesJoined }) => (
        <Box component="li" {...optionProps}>
          <Typography noWrap component="span" variant="subtitle2">
            <Typography component="span" variant="subtitle2">
              {t('subjectOptions:blockN', { number: blockIdx + 1 })}
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
