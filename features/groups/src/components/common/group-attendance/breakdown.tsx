import { Stack, StackProps, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { getColourBasedOnAttendanceType } from '@tyro/core';
import { AttendanceCodeType } from '@tyro/api';
import { useMemo } from 'react';
import { useAttendanceCodeByType } from '@tyro/attendance';
import { StudentAttendance } from '../../../hooks';

type AttendanceBreakdownProps = StackProps & {
  attendance: StudentAttendance;
};

export const AttendanceBreakdown = ({
  attendance,
  ...containerProps
}: AttendanceBreakdownProps) => {
  const { t } = useTranslation(['common']);

  const codesByType = useAttendanceCodeByType({ teachingGroupCodes: true });

  const attendanceTotals = useMemo(() => {
    const attendanceValues = Object.values(attendance);

    const current = attendanceValues.filter(
      ({ attendanceCode }) =>
        attendanceCode.codeType !== AttendanceCodeType.ExplainedAbsence &&
        attendanceCode.codeType !== AttendanceCodeType.UnexplainedAbsence
    );

    return [
      {
        bgColor: 'indigo.100',
        color: 'indigo.600',
        name: t('common:students'),
        count: `${current.length}/${attendanceValues.length}`,
      },
      {
        ...getColourBasedOnAttendanceType(AttendanceCodeType.Present).soft,
        name: t('common:attendanceCode.PRESENT'),
        count: attendanceValues.filter(
          ({ attendanceCode }) =>
            attendanceCode.codeType === AttendanceCodeType.Present
        ).length,
      },
      {
        ...getColourBasedOnAttendanceType(AttendanceCodeType.Late).soft,
        name: t('common:attendanceCode.LATE'),
        count: attendanceValues.filter(
          ({ attendanceCode }) =>
            attendanceCode.codeType === AttendanceCodeType.Late
        ).length,
      },
      {
        ...getColourBasedOnAttendanceType(AttendanceCodeType.ExplainedAbsence)
          .soft,
        name: t('common:absent'),
        count: attendanceValues.filter(
          ({ attendanceCode }) =>
            attendanceCode.codeType === AttendanceCodeType.ExplainedAbsence ||
            attendanceCode.codeType === AttendanceCodeType.UnexplainedAbsence
        ).length,
      },
    ];
  }, [attendance, codesByType]);

  return (
    <Stack
      flexDirection="row"
      border="1px solid"
      borderColor="slate.100"
      bgcolor="background.paper"
      flexWrap="wrap"
      gap={2}
      {...containerProps}
    >
      {attendanceTotals.map(({ name, count, bgColor, color }, index) => (
        <Stack
          key={name}
          flexDirection="row"
          alignItems="center"
          gap={1}
          mr={2}
        >
          <Typography
            variant="body2"
            component="span"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius={5}
            px={1}
            height="28px"
            width={index === 0 ? 'auto' : '28px'}
            bgcolor={bgColor}
            color={color}
          >
            {count}
          </Typography>
          <Typography variant="body2" component="span" color={color}>
            {name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
