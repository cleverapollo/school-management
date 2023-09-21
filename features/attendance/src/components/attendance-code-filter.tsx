import { Box, Chip, ChipProps, Stack, Typography } from '@mui/material';
import { Autocomplete, getColourBasedOnAttendanceType } from '@tyro/core';
import { AttendanceCodeType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import {
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
} from '../api/attendance-codes';
import { iconBasedOnCodeType } from './role-book/attendance-value';

type AttendanceCodesWithoutNotTaken = Exclude<
  AttendanceCodeType,
  AttendanceCodeType.NotTaken
>;

interface AttendanceCodeFilterProps {
  value: ReturnTypeFromUseAttendanceCodes[];
  onChange: (value: ReturnTypeFromUseAttendanceCodes[]) => void;
}

export function AttendanceCodeFilter({
  value,
  onChange,
}: AttendanceCodeFilterProps) {
  const { t } = useTranslation(['attendance']);
  const { data, isLoading } = useAttendanceCodes({});

  return (
    <Autocomplete<ReturnTypeFromUseAttendanceCodes>
      value={value}
      onChange={(_, newValue) => {
        onChange((newValue as ReturnTypeFromUseAttendanceCodes[]) ?? []);
      }}
      label={t('attendance:attendanceCodes')}
      fullWidth
      options={data ?? []}
      loading={isLoading}
      multiple
      sx={{
        maxWidth: 300,
      }}
      optionIdKey="id"
      optionTextKey="name"
      filterOptions={(options, { inputValue }) => {
        if (!inputValue) return options;

        const searchValue = inputValue.toLowerCase();
        return options.filter((option) => {
          const code = option?.name;
          const description = option?.description;
          return (
            code?.toLowerCase().includes(searchValue) ||
            description?.toLowerCase().includes(searchValue)
          );
        });
      }}
      renderTags={(tags, getTagProps) =>
        tags.map((tag, index) => {
          const chipColor = getColourBasedOnAttendanceType(
            tag.sessionCodeType
          ).base;

          return (
            <Chip
              size="small"
              variant="soft"
              color={chipColor as ChipProps['color']}
              label={tag.name}
              {...getTagProps({ index })}
            />
          );
        })
      }
      renderOption={(props, option) => {
        const color = getColourBasedOnAttendanceType(
          option.sessionCodeType
        ).base;

        const icon =
          iconBasedOnCodeType[
            option.sessionCodeType as AttendanceCodesWithoutNotTaken
          ];
        return (
          <Stack
            component="li"
            direction="row"
            spacing={1}
            justifyContent="space-between"
            {...props}
            key={option.id}
          >
            <Stack direction="row" spacing={1} alignItems="center" flex="1">
              <Box display="flex" alignItems="center" color={`${color}.main`}>
                {icon}
              </Box>
              <Typography component="span" variant="subtitle2">
                {option.description}
              </Typography>
            </Stack>
            <Typography
              component="span"
              color={`${color}.main`}
              variant="subtitle2"
            >
              {option.name}
            </Typography>
          </Stack>
        );
      }}
    />
  );
}
