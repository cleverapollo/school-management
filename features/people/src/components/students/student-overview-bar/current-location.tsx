import { Fragment, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CodeType, CurrentStudentLocation, Maybe } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CheckmarkIcon, CloseIcon, MinusIcon } from '@tyro/icons';

interface CurrentAttendanceIconProps {
  name: string | undefined;
  codeType: CodeType | undefined;
}

interface TempCustomCurrentLocation
  extends Omit<CurrentStudentLocation, 'currentAttendance'> {
  currentAttendance: {
    name: string;
    codeType: CodeType;
  };
}

interface CurrentLocationProps {
  currentLocation: Maybe<TempCustomCurrentLocation> | undefined;
}

type AttendanceCodeIconSettings = {
  icon: JSX.Element;
  color: 'green' | 'rose' | 'sky';
  tooltip: string | undefined;
};

function CurrentAttendanceIcon({ name, codeType }: CurrentAttendanceIconProps) {
  const { t } = useTranslation(['attendance']);

  const { icon, color, tooltip } = useMemo((): AttendanceCodeIconSettings => {
    switch (codeType) {
      case CodeType.Present:
      case CodeType.Late:
        return {
          icon: (
            <CheckmarkIcon sx={{ color: 'white', width: 16, height: 16 }} />
          ),
          color: 'green',
          tooltip: name,
        };
      case CodeType.UnexplainedAbsence:
      case CodeType.ExplainedAbsence:
        return {
          icon: <CloseIcon />,
          color: 'rose',
          tooltip: name,
        };
      default:
        return {
          icon: <MinusIcon />,
          color: 'sky',
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

export function CurrentLocation({ currentLocation }: CurrentLocationProps) {
  const { t } = useTranslation(['people']);

  const currentLocationList = useMemo(() => {
    const room =
      currentLocation?.room?.length !== undefined &&
      currentLocation?.room?.length > 0
        ? currentLocation?.room[0]?.name
        : '-';
    return {
      [t('people:currentLocation')]: room,
      [t('people:currentLesson')]: currentLocation?.lesson ?? '-',
      [t('people:currentTeacher')]: currentLocation?.teacher ?? '-',
      [t('people:attendance')]: (
        <CurrentAttendanceIcon
          {...(currentLocation?.currentAttendance ?? {
            name: undefined,
            codeType: undefined,
          })}
        />
      ),
    };
  }, [currentLocation, t]);

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
