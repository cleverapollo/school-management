import { Box, Chip, Stack, Typography } from '@mui/material';
import { Autocomplete } from '@tyro/core';
import { AttendanceCodeType } from '@tyro/api';
import {
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
} from '../../api/attendance-codes';
import { iconBasedOnCodeType, colorsBasedOnCodeType } from './attendance-value';

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
  const { data, isLoading } = useAttendanceCodes({});

  return (
    <Autocomplete<ReturnTypeFromUseAttendanceCodes, true>
      value={value}
      onChange={(_, newValue) => {
        onChange((newValue as ReturnTypeFromUseAttendanceCodes[]) ?? []);
      }}
      label="Attendance codes"
      fullWidth
      options={data ?? []}
      loading={isLoading}
      multiple
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.name
      }
      sx={{
        maxWidth: 300,
      }}
      optionIdKey="id"
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
        tags.map((tag, index) => (
          <Chip
            size="small"
            variant="soft"
            color={
              colorsBasedOnCodeType[
                tag.codeType as AttendanceCodesWithoutNotTaken
              ]
            }
            label={tag.name}
            {...getTagProps({ index })}
          />
        ))
      }
      renderOption={(props, option) => {
        const color =
          colorsBasedOnCodeType[
            option.codeType as AttendanceCodesWithoutNotTaken
          ];
        const icon =
          iconBasedOnCodeType[
            option.codeType as AttendanceCodesWithoutNotTaken
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
