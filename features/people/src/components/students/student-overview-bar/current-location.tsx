import { Fragment, useMemo } from 'react';
import { Box } from '@mui/material';
import { CurrentAttendanceIcon } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AttendanceCodeType } from '@tyro/api';
import { usePersonStatus } from '../../../api/person/status';

interface CurrentLocationProps {
  studentPartyId: number | undefined;
}

export function CurrentLocation({ studentPartyId }: CurrentLocationProps) {
  const { t } = useTranslation(['people', 'attendance']);
  const { data } = usePersonStatus(studentPartyId);
  const currentLocationList = useMemo(() => {
    const room = data?.currentLocation?.room
      ?.map((a) => a?.name)
      .find((a) => true);

    // todo  back end for attendnce is not in place

    const currentAttendance =
      data?.currentLocation?.eventId == null ? (
        '-'
      ) : (
        <CurrentAttendanceIcon
          tooltipText={
            data?.currentLocation?.currentAttendance?.codeType ===
            AttendanceCodeType.NotTaken
              ? t('attendance:attendanceNotTaken')
              : data?.currentLocation?.currentAttendance?.attendanceCodeName ??
                undefined
          }
          codeType={
            data?.currentLocation?.currentAttendance?.codeType ?? undefined
          }
        />
      );
    return {
      [t('people:currentLocation')]: room ?? '-',
      [t('people:currentLesson')]: data?.currentLocation?.lesson ?? '-',
      [t('people:currentTeacher')]: data?.currentLocation?.teacher ?? '-',
      [t('people:attendance')]: currentAttendance,
    };
  }, [data, t]);
  return (
    <Box
      component="dl"
      display="grid"
      gridTemplateColumns="repeat(4, auto)"
      gridTemplateRows="repeat(2, auto)"
      alignItems="strech"
      sx={{ my: 0 }}
    >
      {Object.entries(currentLocationList).map(([key, value], index) => (
        <Fragment key={key}>
          <Box
            component="dt"
            gridColumn={(index % 4) + 1}
            gridRow={1}
            sx={{
              fontSize: '0.75rem',
              px: 2,
              py: 1,
              color: 'slate.600',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {key}
          </Box>
          <Box
            component="dd"
            gridColumn={(index % 4) + 1}
            gridRow={2}
            sx={{
              fontSize: '0.75rem',
              ml: 0,
              backgroundColor: 'blue.50',
              py: 0.5,
              px: 2,
              my: 0.5,
              display: 'flex',
              alignItems: 'center',
              ...(index === 0 && { borderRadius: '17px 0 0 17px' }),
              ...(index === 3 && {
                borderRadius: '0 17px 17px 0',
                justifyContent: 'center',
              }),
            }}
          >
            {value}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}
