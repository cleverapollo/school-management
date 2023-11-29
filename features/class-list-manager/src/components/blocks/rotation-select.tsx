import { Typography, SxProps, Theme, Stack } from '@mui/material';
import { Select, StatusIcon } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { CommentStatus } from '@tyro/api';
import { useCallback, useMemo } from 'react';
import { BlockAutocompleteProps } from './block-autocomplete';

type RotationData = {
  iteration: number;
  index: number;
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

  const options = useMemo<RotationData[]>(
    () =>
      rotations.map(({ iteration }, index) => ({
        iteration,
        index,
      })),
    [rotations]
  );

  const getRotationStatus = useCallback(
    ({ startDate, endDate }: RotationSelectProps['rotations'][number]) => {
      const isCompleted = dayjs(endDate).isBefore();
      const isActive = dayjs(startDate).isBefore();

      if (isCompleted) {
        return CommentStatus.Complete;
      }

      if (isActive) {
        return CommentStatus.InProgress;
      }

      return CommentStatus.NotStarted;
    },
    []
  );

  const getOptionLabel = useCallback(
    ({ index, iteration }: RotationData) => {
      const selectedRotation = rotations[index];
      if (!selectedRotation) return '';

      const rotationEndDate = dayjs(selectedRotation.endDate);
      const rotationStartDate = dayjs(selectedRotation.startDate);

      const days = rotationEndDate.diff(selectedRotation.startDate, 'day') + 1;

      const localeParams = {
        startDate: rotationStartDate.format('DD/MM/YYYY'),
        endDate: rotationEndDate.format('DD/MM/YYYY'),
        days,
        count: days,
      };

      const status = getRotationStatus(selectedRotation);
      let info = t('classListManager:rotationScheduled', localeParams);

      if (status === CommentStatus.Complete) {
        info = t('classListManager:rotationCompletedOn', localeParams);
      } else if (status === CommentStatus.InProgress) {
        info = t('classListManager:rotationActive', localeParams);
      }

      return (
        <Stack>
          <Stack direction="row" gap={0.5} alignItems="center">
            <StatusIcon size="small" status={status} />
            <Typography variant="subtitle2">
              {t('classListManager:rotationX', { number: iteration })}
            </Typography>
          </Stack>
          <Typography ml={2.5} variant="caption" color="text.secondary">
            {info}
          </Typography>
        </Stack>
      );
    },
    [rotations, getRotationStatus]
  );

  return (
    <Select
      label={t('classListManager:rotation')}
      variant="white-filled"
      value={value}
      renderValue={({ iteration, index }) => (
        <Stack direction="row" gap={0.5} alignItems="center">
          <StatusIcon
            size="small"
            status={getRotationStatus(rotations[index])}
          />
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
      menuItemProps={{
        sx: {
          p: 0.5,
        },
      }}
    />
  );
}
