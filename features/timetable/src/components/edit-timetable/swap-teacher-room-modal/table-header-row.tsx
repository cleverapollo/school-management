import { Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { ReturnTypeOfUseSwapTeacherAndRoom } from '../../../hooks/use-swap-teacher-and-room-modal';

interface TableHeaderRowProps {
  changeState: ReturnTypeOfUseSwapTeacherAndRoom['changeState'];
  firstRowLabel: string;
}

export function TableHeaderRow({
  changeState,
  firstRowLabel,
}: TableHeaderRowProps) {
  const { t } = useTranslation(['common', 'timetable']);

  return (
    <TableRow>
      <TableCell>{firstRowLabel}</TableCell>
      {changeState?.map((lesson) => {
        const day = dayjs().set('day', lesson.timeslotId?.dayIdx ?? 0);

        return (
          <TableCell key={JSON.stringify(lesson.id)}>
            <Stack>
              <span>{lesson.partyGroup.name}</span>
              <Tooltip
                title={t('timetable:dayAtTime', {
                  day: day.format('dddd'),
                  time: lesson.timeslotInfo?.startTime,
                })}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography component="span" className="day-initial">
                    {day.format('dd')[0]}
                  </Typography>
                  <Typography component="span" className="resource-start-time">
                    {lesson.timeslotInfo?.startTime}
                  </Typography>
                </Stack>
              </Tooltip>
            </Stack>
          </TableCell>
        );
      })}
      <TableCell>{t('common:status')}</TableCell>
    </TableRow>
  );
}
