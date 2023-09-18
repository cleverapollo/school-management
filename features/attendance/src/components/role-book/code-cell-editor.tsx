import { useCallback } from 'react';
import { ICellEditorParams, TableSelect } from '@tyro/core';
import { Box, Stack, Typography } from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';
import { TFunction } from '@tyro/i18n';
import { EditIcon } from '@tyro/icons';
import { ReturnTypeFromUseAttendanceCodes } from '../../api/attendance-codes';
import { colorsBasedOnCodeType, iconBasedOnCodeType } from './attendance-value';
import { ReturnTypeFromSessionAttendance } from '../../api/session-attendance';
import { getColourBasedOnAttendanceType } from '../../utils/get-attendance-type-colour';

type AttendanceCodesWithoutNotTaken = Exclude<
  AttendanceCodeType,
  AttendanceCodeType.NotTaken
>;

type NoteOption = {
  id: 'session-note';
  description: string;
};

const renderSelectOption = (
  option: ReturnTypeFromUseAttendanceCodes | NoteOption
) => {
  if (option.id === 'session-note') {
    return (
      <Stack flex={1} direction="row" spacing={1} alignItems="center">
        <Box display="flex" alignItems="center" color="slate.main">
          <EditIcon />
        </Box>
        <Typography component="span" variant="subtitle2">
          {option.description}
        </Typography>
      </Stack>
    );
  }

  const color =
    colorsBasedOnCodeType[
      option.sessionCodeType as AttendanceCodesWithoutNotTaken
    ];
  const icon =
    iconBasedOnCodeType[
      option.sessionCodeType as AttendanceCodesWithoutNotTaken
    ];

  const updatedColor = getColourBasedOnAttendanceType(color);

  return (
    <Stack flex={1} direction="row" spacing={1} justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center" flex={1}>
        <Box display="flex" alignItems="center" color={updatedColor}>
          {icon}
        </Box>
        <Typography component="span" variant="subtitle2">
          {option.description}
        </Typography>
      </Stack>
      <Typography component="span" color={updatedColor} variant="subtitle2">
        {option.name}
      </Typography>
    </Stack>
  );
};

export function AttendanceCodeCellEditor(
  key: string,
  t: TFunction<('common' | 'attendance')[]>,
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[]
) {
  const getOptions = (hasNote: boolean, hasAttendanceCode: boolean) => [
    attendanceCodes,
    [
      {
        id: 'session-note',
        name: 'session-note',
        description: hasNote
          ? t('attendance:editNote')
          : t('attendance:addNote'),
        disabled: !hasAttendanceCode,
        disabledTooltip: t(
          'attendance:youMustSelectAttendanceCodeBeforeApplyingANote'
        ),
      } as const,
    ],
  ];

  return ({ data }: ICellEditorParams<ReturnTypeFromSessionAttendance>) =>
    ({
      component: TableSelect<ReturnTypeFromUseAttendanceCodes>,
      popup: true,
      popupPosition: 'under',
      params: {
        options: getOptions(!!data.noteByKey[key], !!data.attendanceByKey[key]),
        optionIdKey: 'name',
        renderOption: renderSelectOption,
      },
    } as const);
}
