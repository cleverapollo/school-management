import { Fragment, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AttendanceCodeType, CurrentStudentLocation } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CheckmarkIcon, CloseIcon, MinusIcon } from '@tyro/icons';
import { useStudentStatus } from '../../../api/status';

interface CurrentAttendanceIconProps {
  name: string | undefined;
  codeType: AttendanceCodeType | undefined;
}

interface TempCustomCurrentLocation
  extends Omit<CurrentStudentLocation, 'currentAttendance'> {
  currentAttendance: {
    name: string;
    codeType: AttendanceCodeType;
  };
}

interface CurrentLocationProps {
  studentPartyId: number | undefined;
}

type AttendanceCodeIconSettings = {
  icon: JSX.Element;
  color: 'green' | 'rose' | 'blue';
  tooltip: string | undefined;
};

function CurrentAttendanceIcon({ name, codeType }: CurrentAttendanceIconProps) {
  const { t } = useTranslation(['attendance']);

  const { icon, color, tooltip } = useMemo((): AttendanceCodeIconSettings => {
    switch (codeType) {
      case AttendanceCodeType.Present:
      case AttendanceCodeType.Late:
        return {
          icon: (
            <CheckmarkIcon sx={{ color: 'white', width: 16, height: 16 }} />
          ),
          color: 'green',
          tooltip: name,
        };
      case AttendanceCodeType.UnexplainedAbsence:
      case AttendanceCodeType.ExplainedAbsence:
        return {
          icon: <CloseIcon sx={{ color: 'white', width: 16, height: 16 }} />,
          color: 'rose',
          tooltip: name,
        };
      default:
        return {
          icon: <MinusIcon sx={{ color: 'white', width: 16, height: 16 }} />,
          color: 'blue',
          tooltip: t('attendance:attendanceNotTaken'),
        };
    }
  }, [codeType, name, t]);

  return (
    <Tooltip title={tooltip}>
      <Box
        sx={({ palette }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(palette[color]['500'], 0.35),
          width: 26,
          height: 26,
          borderRadius: '50%',
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${color}.500`,
            width: 20,
            height: 20,
            borderRadius: '50%',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Tooltip>
  );
}

export function CurrentLocation({ studentPartyId }: CurrentLocationProps) {
  const { t } = useTranslation(['people']);
  const { data } = useStudentStatus(studentPartyId);
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
          name={
            data?.currentLocation?.currentAttendance?.attendanceCodeName ??
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
      gridTemplateRows="repeat(2, 1fr)"
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
              py: 0.5,
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
