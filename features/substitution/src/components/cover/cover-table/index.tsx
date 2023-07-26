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
import { Avatar, useDebouncedValue, usePreferredNameLayout } from '@tyro/core';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarGridPeriodType } from '@tyro/api';
import { useMemo } from 'react';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverBreakOrFinished } from './cover-break-or-finished';
import { EventCoverCard } from './event-card';
import { EmptyStateContainer } from './empty-state-container';
import { useCoverTable, CoverTableRow } from '../../../hooks/use-cover-table';
import { ApplyCoverModal } from './apply-cover-modal';

interface CoverTableProps {
  userAsFirstColumn?: boolean;
  onLinkClick?: (
    staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'],
    date: Dayjs
  ) => void;
  datepicker: React.ReactNode;
  data: CoverTableRow[];
  isLoading?: boolean;
}

export function CoverTable({
  userAsFirstColumn = false,
  onLinkClick,
  datepicker,
  data,
  isLoading = false,
}: CoverTableProps) {
  const { t } = useTranslation(['timetable']);
  const { displayName } = usePreferredNameLayout();
  const { onSelectEvent, isEventSelected, selectedEventsMap } =
    useCoverTable(data);
  const {
    value: eventsForApplyCover,
    debouncedValue: debouncedEventsForApplyCover,
    setValue: setEventsForApplyCover,
  } = useDebouncedValue<typeof selectedEventsMap | null>({
    defaultValue: null,
  });

  const periods = useMemo(() => {
    const periodsLengthsPerRow =
      data?.map(({ dayInfo }) => dayInfo.periods.length) ?? [];
    const numberOfPeriods = Math.max(...periodsLengthsPerRow, 0);

    return Array.from({ length: numberOfPeriods }, (_, i) => i + 1);
  }, [data]);

  return (
    <>
      <Card>
        <Stack direction="row" justifyContent="center" p={2}>
          {datepicker}
        </Stack>
        <EmptyStateContainer isEmpty={!data?.length} isLoading={isLoading}>
          <TableContainer>
            <Table
              stickyHeader
              sx={({ palette }) => ({
                '& th, & td': {
                  border: `1px solid ${palette.divider}`,
                  p: 1,
                },
                '& th': {
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
                {data.map(({ staff, dayInfo, periods: periodValues }) => {
                  const id = userAsFirstColumn
                    ? staff.partyId
                    : dayjs(dayInfo.date).format('YYYY-MM-DD');
                  const dateString = dayjs(dayInfo?.date).format('YYYY-MM-DD');
                  const label = userAsFirstColumn
                    ? displayName(staff)
                    : dayjs(dayInfo.date).format('DD/MM/YYYY');

                  return (
                    <TableRow key={id}>
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center">
                          {userAsFirstColumn && (
                            <Avatar
                              src={staff.avatarUrl}
                              name={label}
                              sx={{
                                my: 1,
                                mr: 1.5,
                              }}
                            />
                          )}
                          {onLinkClick ? (
                            <Link
                              component="button"
                              onClick={() =>
                                onLinkClick(staff, dayjs(dayInfo.date))
                              }
                            >
                              {label}
                            </Link>
                          ) : (
                            <span>{label}</span>
                          )}
                        </Stack>
                      </TableCell>
                      {periods.map((_period, index) => {
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
                            {eventInfo && (
                              <EventCoverCard
                                event={eventInfo.event}
                                staff={staff}
                                substitution={eventInfo.substitution}
                                isEventSelected={isEventSelected}
                                toggleEventSelection={onSelectEvent}
                                applyCover={(anchorEvent) =>
                                  setEventsForApplyCover(
                                    new Map([
                                      ...selectedEventsMap.entries(),
                                      [anchorEvent.eventId, anchorEvent],
                                    ])
                                  )
                                }
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
        </EmptyStateContainer>
      </Card>
      <ApplyCoverModal
        open={!!eventsForApplyCover}
        onClose={() => setEventsForApplyCover(null)}
        eventsMap={eventsForApplyCover ?? debouncedEventsForApplyCover}
      />
    </>
  );
}
