import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTranslation } from '@tyro/i18n';
import { useCoreAcademicNamespace } from '@tyro/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { AcademicCalendar } from './calendar';
import { useCalendarAttendance } from '../../../api/student/attendance/calendar-attendance';

const attendanceCodeColours = {
  all: [{ colour: 'indigo', translationText: 'all' }],
  totalPresent: [{ colour: 'emerald', translationText: 'present' }],
  totalLate: [{ colour: 'sky', translationText: 'late' }],
  totalAbsent: [{ colour: 'pink', translationText: 'absent' }],
  totalUnexplained: [{ colour: 'red', translationText: 'unexplainedAbsence' }],
  totalNotTaken: [{ colour: 'grey', translationText: 'notTaken' }],
};

export const MonthOverview = () => {
  const { t } = useTranslation(['attendance', 'people']);
  const { id } = useParams();

  const { data: namespaces } = useCoreAcademicNamespace();
  const activeAcademicNamespace = namespaces?.find(
    (academicNamespace) => academicNamespace?.isActiveDefaultNamespace
  );

  const currentDate = dayjs();
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');
  const startDate = activeAcademicNamespace?.startDate;
  const endDate = activeAcademicNamespace?.endDate;

  const { data: calendarAttendance } = useCalendarAttendance({
    partyId: Number(id),
    from: !startDate ? formattedCurrentDate : startDate,
    to: !endDate ? formattedCurrentDate : endDate,
  });

  const attendanceCounts = calendarAttendance?.attendances ?? [];
  const totalAttendanceDays = attendanceCounts.length;

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardHeader
          component="h3"
          title={t(`people:academicYear`, {
            year: activeAcademicNamespace?.name,
          })}
          sx={{
            p: 0,
            mt: 2,
            border: 0,
            textAlign: 'center',
            fontWeight: 600,
            '& .css-8ebtji-MuiTypography-root': {
              fontWeight: 600,
            },
          }}
        />
      </Stack>

      <CardContent>
        <Stack
          direction="row"
          display="flex"
          flexWrap={{ sm: 'nowrap', md: 'wrap' }}
          marginLeft={1}
          sx={{
            overflowX: { xs: 'scroll', md: 'hidden' },
            '&::-webkit-scrollbar': {
              width: 0,
            },
          }}
        >
          {Object.entries(attendanceCodeColours).map(([code, colour]) => {
            const attendanceData = colour[0];
            const individualAttendanceCount =
              calendarAttendance &&
              (calendarAttendance[
                code as keyof typeof calendarAttendance
              ] as number);

            const labelText =
              code === 'all' ? totalAttendanceDays : individualAttendanceCount;

            return (
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                marginRight={3}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${attendanceData?.colour}.100`,
                    borderRadius: '6px',
                    padding: 0,
                  }}
                >
                  <Chip
                    label={labelText}
                    variant="soft"
                    sx={{
                      backgroundColor: 'transparent',
                      height: '20px',
                      fontWeight: '700',
                      fontSize: '12px',
                      paddingX: '8px',
                      color: `${attendanceData?.colour}.500`,
                      '& .MuiChip-icon': {
                        color: `${attendanceData?.colour}.500`,
                      },
                      '& .MuiChip-label': {
                        padding: 0,
                      },
                    }}
                  />
                </Box>
                <Typography
                  color="#637381"
                  marginLeft={1}
                  sx={{
                    fontWeight: '600',
                    fontSize: '14px',
                    textWrap: 'nowrap',
                  }}
                >
                  {/* @ts-ignore  */}
                  {t(`attendance:${code}`)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>

        <Box
          sx={{
            backgroundColor: { xs: 'transparent', sm: 'slate.50' },
            borderRadius: '16px',
            marginY: 2,
            paddingBottom: 2,
            paddingX: { xs: 0, sm: 4 },
          }}
        >
          <AcademicCalendar
            studentPartyId={id ?? ''}
            calendarAttendance={calendarAttendance}
            activeAcademicNamespace={activeAcademicNamespace}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
