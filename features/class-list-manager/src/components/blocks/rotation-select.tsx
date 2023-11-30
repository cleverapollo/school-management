import { Typography, SxProps, Theme, Stack } from '@mui/material';
import { Select } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { BlockAutocompleteProps } from './block-autocomplete';
import { RotationStatusChip } from './rotation-status-chip';
import { RotationStatusIcon } from './rotation-status-icon';
import { RotationStatus } from './types';

type RotationData = {
  iteration: number;
  index: number;
  status: RotationStatus;
};

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

  const options = useMemo<RotationData[]>(() => {
    let hasNext = false;

    return rotations.map(({ iteration, endDate, startDate }, index) => {
      const isCompleted = dayjs(endDate).isBefore();
      const isActive = dayjs(startDate).isBefore();

      const rotationData = {
        iteration,
        index,
      };

      if (isCompleted) {
        return {
          ...rotationData,
          status: RotationStatus.Complete,
        };
      }

      if (isActive) {
        return {
          ...rotationData,
          status: RotationStatus.Active,
        };
      }

      if (!hasNext) {
        hasNext = true;

        return {
          ...rotationData,
          status: RotationStatus.Next,
        };
      }

      return {
        ...rotationData,
        status: RotationStatus.Future,
      };
    });
  }, [rotations]);

  const getOptionLabel = useCallback(
    ({ index, iteration, status }: RotationData) => {
      const selectedRotation = rotations[index];
      if (!selectedRotation) return '';

      const rotationEndDate = dayjs(selectedRotation.endDate);
      const rotationStartDate = dayjs(selectedRotation.startDate);
      const days = rotationEndDate.diff(selectedRotation.startDate, 'day') + 1;

      return (
        <Stack flexDirection="row" alignItems="center" gap={1.25} width="100%">
          <RotationStatusIcon status={status} />
          <Stack width="100%" gap={0.25}>
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                {t('classListManager:rotationX', { number: iteration })}
              </Typography>
              <RotationStatusChip status={status} />
            </Stack>
            <Stack flexDirection="row" gap={4} justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {t('classListManager:forDays', { count: days })}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={status === RotationStatus.Active ? 600 : 400}
              >
                <span>{rotationStartDate.format('DD/MM/YYYY')}</span>
                <Typography variant="caption">
                  {` ${t('classListManager:to')} `}
                </Typography>
                <span>{rotationEndDate.format('DD/MM/YYYY')}</span>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      );
    },
    [rotations]
  );

  return (
    <Select
      label={t('classListManager:rotation')}
      variant="white-filled"
      value={value}
      renderValue={({ iteration, status }) => (
        <Stack direction="row" gap={0.5} alignItems="center">
          <RotationStatusIcon status={status} />
          <Typography>
            {t('classListManager:rotationX', { number: iteration })}
          </Typography>
        </Stack>
      )}
      onChange={(event) => {
        onChange(Number(event.target.value));
      }}
      optionIdKey="index"
      getOptionLabel={getOptionLabel}
      options={options}
      sx={sx}
    />
  );
}
