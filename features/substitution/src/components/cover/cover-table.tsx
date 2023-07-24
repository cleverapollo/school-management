import {
  Card,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar } from '@tyro/core';
import dayjs from 'dayjs';
import { CalendarGridPeriodType } from '@tyro/api';
import { ReturnTypeFromUseEventsForCover } from '../../api/staff-work-events-for-cover';
import { CoverBreakOrFinished } from './cover-break-or-finished';

interface CoverTableRow {
  id: string;
  firstColumn: {
    label: string;
    avatarUrl?: string | null;
    linkAction?: () => void;
  };
  dayInfo: ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'][number]['dayInfo'];
  periods: (
    | ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'][number]['substitutionEventsByPeriod'][number]
    | null
  )[];
}

interface CoverTableProps {
  periods: number[];
  showAvatar?: boolean;
  datepicker: React.ReactNode;
  data: CoverTableRow[];
}

export function CoverTable({
  periods,
  showAvatar = false,
  datepicker,
  data,
}: CoverTableProps) {
  const { t } = useTranslation(['timetable']);

  return (
    <Card>
      <Stack direction="row" justifyContent="center" p={2}>
        {datepicker}
      </Stack>
      <TableContainer>
        <Table
          stickyHeader
          sx={({ palette }) => ({
            '& th, & td': {
              border: `1px solid ${palette.divider}`,
              p: 1,
            },
            '& thead th': {
              backgroundColor: 'white',
              color: 'text.primary',
              fontWeight: 600,
              backgroundImage: 'none',
              textAlign: 'center',
            },
            '& tbody td, & tbody th': {
              verticalAlign: 'top',
            },
            borderCollapse: 'collapse',
            'th:first-of-type': {
              position: 'sticky',
              left: 0,
              zIndex: 1,
              backgroundColor: 'white',
            },
            // Remove edge border
            '& th:first-of-type': {
              borderLeft: 'none',
            },
            '& th:last-child, & td:last-child': {
              borderRight: 'none',
            },
            '& tbody tr:last-child td, & tbody tr:last-child th': {
              borderBottom: 'none',
            },
          })}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              {periods.map((period) => (
                <TableCell key={JSON.stringify(period)}>
                  {t(`timetable:periodNumber`, {
                    number: period,
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ id, firstColumn, dayInfo, periods: periodValues }) => {
              const dateString = dayjs(dayInfo?.date).format('YYYY-MM-DD');

              return (
                <TableRow key={id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      {showAvatar && (
                        <Avatar
                          src={firstColumn.avatarUrl}
                          name={firstColumn.label}
                          sx={{
                            my: 1,
                            mr: 1.5,
                          }}
                        />
                      )}
                      {firstColumn.linkAction ? (
                        <Link
                          component="button"
                          onClick={firstColumn.linkAction}
                        >
                          {firstColumn.label}
                        </Link>
                      ) : (
                        <span>{firstColumn.label}</span>
                      )}
                    </Stack>
                  </TableCell>
                  {periods.map((period, index) => {
                    const periodInfo = dayInfo?.periods[index];
                    const eventInfo = periodValues[index];

                    const isBreak =
                      periodInfo?.type === CalendarGridPeriodType.Break;
                    const isFinished = !periodInfo?.type;

                    return (
                      <TableCell key={`${id}-${dateString}-${index}`}>
                        {(isBreak || isFinished) && (
                          <CoverBreakOrFinished
                            timeslotInfo={periodInfo}
                            type={isBreak ? 'break' : 'finished'}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
