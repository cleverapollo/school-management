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
import {
  Avatar,
  ConfirmDialog,
  useDebouncedValue,
  usePreferredNameLayout,
} from '@tyro/core';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarGridPeriodType } from '@tyro/api';
import { useMemo, useState } from 'react';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverBreakOrFinished } from './cover-break-or-finished';
import { EventCoverCard } from './event-card';
import { EmptyStateContainer } from './empty-state-container';
import { useCoverTable, CoverTableRow } from '../../../hooks/use-cover-table';
import { ApplyCoverModal } from '../apply-cover-modal';
import { useApplyCover } from '../../../api/apply-cover';
import { useDeleteCover } from '../../../api/remove-cover';

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
  const { t } = useTranslation(['timetable', 'common', 'substitution']);
  const { displayName } = usePreferredNameLayout();
  const { mutateAsync: deleteCover, isLoading: isSaving } = useDeleteCover();
  const { onSelectEvent, isEventSelected, selectedEventsMap } =
    useCoverTable(data);

  const [applySubstitutionModal, setApplySubstitutionModal] =
    useState<boolean>(false);
  const [removeSubstitutionModal, setRemoveSubstitutionModal] =
    useState<boolean>(false);
  const {
    value: eventsForApplyCover,
    debouncedValue: debouncedEventsForApplyCover,
    setValue: setEventsForApplyCover,
  } = useDebouncedValue<typeof selectedEventsMap | null>({
    defaultValue: null,
  });

  // const {
  //   value: eventsForApplyCover,
  //   debouncedValue: debouncedeventsForApplyCover,
  //   setValue: seteventsForApplyCover,
  // } = useDebouncedValue<typeof selectedEventsMap | null>({
  //   defaultValue: null,
  // });

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
                              noWrap
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
                                eventInfo={eventInfo}
                                staff={staff}
                                isEventSelected={isEventSelected}
                                toggleEventSelection={onSelectEvent}
                                selectedEvents={Array.from(
                                  selectedEventsMap.values()
                                )}
                                applyCover={(anchorEvent) => {
                                  setEventsForApplyCover(
                                    new Map([
                                      ...selectedEventsMap.entries(),
                                      [anchorEvent.event.eventId, anchorEvent],
                                    ])
                                  );
                                  setApplySubstitutionModal(true);
                                }}
                                removeCover={(anchorEvent) => {
                                  setEventsForApplyCover(
                                    new Map([
                                      ...selectedEventsMap.entries(),
                                      [anchorEvent.event.eventId, anchorEvent],
                                    ])
                                  );
                                  setRemoveSubstitutionModal(true);
                                }}
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
        open={applySubstitutionModal}
        onClose={() => {
          setEventsForApplyCover(null);
          setApplySubstitutionModal(false);
        }}
        eventsMap={eventsForApplyCover ?? debouncedEventsForApplyCover}
      />
      <ConfirmDialog
        open={removeSubstitutionModal}
        title={t('substitution:removeCover')}
        description={t('substitution:youAreAboutToRemoveCover', {
          dates: Array.from(eventsForApplyCover?.values() || [])
            .map((a) => dayjs(a.event.startTime))
            .sort((a, b) => a.date() - b.date())
            .map((a) => dayjs(a).format('DD/MM/YYYY'))
            .filter((x, i, a) => a.indexOf(x) === i)
            .join(', '),
        })}
        confirmText={t('substitution:removeCover')}
        onConfirm={async () => {
          console.log(eventsForApplyCover);
          const substitutionIds = Array.from(
            eventsForApplyCover?.values() || []
          )
            .map((s) => s.substitution?.substitutionId || -1)
            .filter((s) => s !== -1);
          await deleteCover({ substitutionIds });
        }}
        onClose={() => {
          setEventsForApplyCover(null);
          setRemoveSubstitutionModal(false);
        }}
      />
    </>
  );
}
// deleteCover({ substitutionIds: [1]
