import { Stack, StackProps, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { getColourBasedOnAttendanceType } from '@tyro/core';
import { AttendanceCodeType } from '@tyro/api';
import { useMemo } from 'react';
import { useAttendanceCodeById } from '@tyro/attendance';
import { StudentAttendance } from '../../../hooks';

type AttendanceBreakdownProps = StackProps & {
  attendance: StudentAttendance;
};

export const AttendanceBreakdown = ({
  attendance,
  ...containerProps
}: AttendanceBreakdownProps) => {
  const { t } = useTranslation(['common']);

  const codeById = useAttendanceCodeById({});

  const attendanceTotals = useMemo(() => {
    const currentAttendanceCodes = Object.values(attendance).map(
      ({ attendanceCodeId: codeId }) => codeById?.[codeId]
    );

    const current = currentAttendanceCodes.filter(
      (code) =>
        code?.codeType !== AttendanceCodeType.ExplainedAbsence &&
        code?.codeType !== AttendanceCodeType.UnexplainedAbsence
    );

    return [
      {
        bgColor: 'indigo.100',
        color: 'indigo.600',
        name: t('common:students'),
        count: `${current.length}/${currentAttendanceCodes.length}`,
      },
      {
        ...getColourBasedOnAttendanceType(AttendanceCodeType.Present).soft,
        name: t('common:attendanceCode.PRESENT'),
        count: currentAttendanceCodes.filter(
          (code) => code?.codeType === AttendanceCodeType.Present
        ).length,
      },
      {
        ...getColourBasedOnAttendanceType(AttendanceCodeType.Late).soft,
        name: t('common:attendanceCode.LATE'),
        count: currentAttendanceCodes.filter(
          (code) => code?.codeType === AttendanceCodeType.Late
        ).length,
      },
      {
        ...getColourBasedOnAttendanceType(AttendanceCodeType.ExplainedAbsence)
          .soft,
        name: t('common:absent'),
        count: currentAttendanceCodes.filter(
          (code) =>
            code?.codeType === AttendanceCodeType.ExplainedAbsence ||
            code?.codeType === AttendanceCodeType.UnexplainedAbsence
        ).length,
      },
    ];
  }, [attendance, codeById]);

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
