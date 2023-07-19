import {
  Box,
  Stack,
  SxProps,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { getLessonDayAndTime } from '../../../utils/get-lesson-day-time';
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room-modal';

interface TableHeaderRowProps {
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
  firstRowLabel: string;
}

export const getFixedRowStyles = (
  hoveredColumnIndex: number,
  numberOfFixedRows: number
): SxProps => ({
  [`& tr td:nth-of-type(${hoveredColumnIndex})`]: {
    backgroundColor: 'slate.50',
  },
  'tr.fixed-row': {
    position: 'sticky',
    width: '100%',
    zIndex: 1,

    '& td': {
      backgroundColor: 'slate.50',
    },
  },

  [`tr:nth-of-type(${numberOfFixedRows})`]: {
    backgroundColor: 'red',
    '& td:first-of-type': {
      borderBottomLeftRadius: 12,
    },
    '& td:last-of-type': {
      borderBottomRightRadius: 12,
    },
  },
});

export const TABLE_HEADER_ROW_HEIGHT = 58;

export function TableHeaderRow({
  changeState,
  firstRowLabel,
}: TableHeaderRowProps) {
  const { t } = useTranslation(['common', 'timetable']);

  return (
    <TableRow>
      <TableCell>{firstRowLabel}</TableCell>
      {changeState?.map((lesson) => {
        const { day, time } = getLessonDayAndTime(lesson);

        return (
          <TableCell key={JSON.stringify(lesson.id)}>
            <Stack>
              <span>{lesson.partyGroup.name}</span>
              <Box display="flex">
                <Tooltip
                  title={t('timetable:dayAtTime', {
                    day: day.format('dddd'),
                    time,
                  })}
                >
                  <Stack
                    display="inline-flex"
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography component="span" className="day-initial">
                      {day.format('dd')[0]}
                    </Typography>
                    <Typography
                      component="span"
                      className="resource-start-time"
                    >
                      {lesson.timeslotInfo?.startTime}
                    </Typography>
                  </Stack>
                </Tooltip>
              </Box>
            </Stack>
          </TableCell>
        );
      })}
      <TableCell>{t('common:status')}</TableCell>
    </TableRow>
  );
}
