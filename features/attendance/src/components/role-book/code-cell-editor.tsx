import { TableSelect } from '@tyro/core';
import { Box, Stack, Typography } from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';
import { ReturnTypeFromUseAttendanceCodes } from '../../api/attendance-codes';
import { colorsBasedOnCodeType, iconBasedOnCodeType } from './attendance-value';

type AttendanceCodesWithoutNotTaken = Exclude<
  AttendanceCodeType,
  AttendanceCodeType.NotTaken
>;

export function AttendanceCodeCellEditor(
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[]
) {
  return () =>
    ({
      component: TableSelect<ReturnTypeFromUseAttendanceCodes>,
      popup: true,
      popupPosition: 'under',
      params: {
        options: attendanceCodes,
        optionIdKey: 'name',
        renderOption: (option: ReturnTypeFromUseAttendanceCodes) => {
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
              flex={1}
              direction="row"
              spacing={1}
              justifyContent="space-between"
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
        },
      },
    } as const);
}
