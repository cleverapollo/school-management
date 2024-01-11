import {
  Box,
  Card,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { ActionMenu, Avatar, useDebouncedValue } from '@tyro/core';
import dayjs, { Dayjs } from 'dayjs';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { CalendarGridPeriodType } from '@tyro/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ArrowRightIcon, InfoCircleIcon, PrinterIcon } from '@tyro/icons';
import { getEventId } from '../../../utils/cover-utils';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverBreakOrFinished } from './cover-break-or-finished';
import { EventCoverCard } from './event-card';
import { EmptyStateContainer } from './empty-state-container';
import {
  useCoverTable,
  CoverTableRow,
  ReturnTypeOfUseCoverTable,
} from '../../../hooks/use-cover-table';
import { ApplyCoverModal } from '../apply-cover-modal';
import { RemoveCoverModal } from '../remove-cover-modal';

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

const columnHelper = createColumnHelper<CoverTableRow>();

const getColumnHeaders = (
  t: TFunction<('timetable' | 'common' | 'substitution')[]>,
  userAsFirstColumn: boolean,
  onLinkClick: CoverTableProps['onLinkClick'],
  periods: number[],
  isCompact: boolean,
  coverCardProps: ReturnTypeOfUseCoverTable & {
    eventIdWithContextMenuOpen: string | null;
    setEventIdWithContextMenuOpen: Dispatch<SetStateAction<string | null>>;
    setEventsForApplyCover: Dispatch<
      SetStateAction<ReturnTypeOfUseCoverTable['selectedEventsMap'] | null>
    >;
    setEventsForDeleteCover: Dispatch<
      SetStateAction<ReturnTypeOfUseCoverTable['selectedEventsMap'] | null>
    >;
  }
) => [
  columnHelper.accessor(
    ({ staff, dayInfo }) =>
      userAsFirstColumn
        ? `${staff?.firstName ? staff.firstName[0] : ''}. ${
            staff?.lastName ?? ''
          }`
        : dayjs(dayInfo.date).format('L'),
    {
      id: userAsFirstColumn ? 'firstName' : 'date',
      header: userAsFirstColumn ? t('common:name') : t('common:date'),
      cell: ({
        row: {
          original: { staff, dayInfo, requireSubstitutionReason },
        },
      }) => {
        const label = userAsFirstColumn
          ? `${staff?.firstName ? staff.firstName[0] : ''}. ${
              staff?.lastName ?? ''
            }`
          : dayjs(dayInfo.date).format('L');
        return (
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
                onClick={() => onLinkClick(staff, dayjs(dayInfo.date))}
                noWrap
              >
                {label}
              </Link>
            ) : (
              <span>{label}</span>
            )}
            {requireSubstitutionReason?.note && (
              <Tooltip title={requireSubstitutionReason.note}>
                <InfoCircleIcon
                  sx={{
                    width: 16,
                    height: 16,
                    color: 'slate.500',
                    ml: 0.5,
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        );
      },
    }
  ),
  columnHelper.accessor('requireSubstitutionReason.reason', {
    header: () => t('substitution:reason'),
    size: 100,
  }),
  ...periods.map((period, index) =>
    columnHelper.display({
      id: `periods.${period - 1}`,
      header: () =>
        t(`timetable:periodNumber`, {
          number: period,
        }),
      cell: ({
        row: {
          original: { staff, dayInfo, periods: periodsValues },
        },
      }) => {
        const periodInfo = dayInfo?.periods[index];
        const eventInfo = periodsValues[index];
        const {
          isEventSelected,
          onSelectEvent,
          selectedEventsMap,
          setEventsForApplyCover,
          setEventsForDeleteCover,
          eventIdWithContextMenuOpen,
          setEventIdWithContextMenuOpen,
        } = coverCardProps;

        const isBreak = periodInfo?.type === CalendarGridPeriodType.Break;
        const isFinished = !periodInfo?.type;

        return (
          <Stack spacing={0.5}>
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
                isContextMenuOpen={
                  eventIdWithContextMenuOpen === getEventId(eventInfo)
                }
                onOpenContextMenu={() => {
                  setEventIdWithContextMenuOpen(getEventId(eventInfo));
                }}
                onCloseContextMenu={() => {
                  setEventIdWithContextMenuOpen(null);
                }}
                isEventSelected={isEventSelected}
                toggleEventSelection={onSelectEvent}
                selectedEvents={Array.from(selectedEventsMap.values())}
                applyCover={() => {
                  setEventsForApplyCover(selectedEventsMap);
                }}
                editCover={() => {
                  setEventsForApplyCover(selectedEventsMap);
                }}
                removeCover={() => {
                  setEventsForDeleteCover(selectedEventsMap);
                }}
              />
            )}
          </Stack>
        );
      },
      size: isCompact ? 106 : 146,
      minSize: 106,
    })
  ),
];

export function CoverTable({
  userAsFirstColumn = false,
  onLinkClick,
  datepicker,
  data,
  isLoading = false,
}: CoverTableProps) {
  const { t } = useTranslation(['timetable', 'common', 'substitution']);
  const coverTableProps = useCoverTable(data);
  const isCompact = useMediaQuery('(max-width: 1980px)');
  const [eventIdWithContextMenuOpen, setEventIdWithContextMenuOpen] = useState<
    string | null
  >(null);

  const {
    value: eventsForApplyCover,
    debouncedValue: debouncedEventsForApplyCover,
    setValue: setEventsForApplyCover,
  } = useDebouncedValue<typeof coverTableProps.selectedEventsMap | null>({
    defaultValue: null,
  });
  const {
    value: eventsForDeleteCover,
    debouncedValue: debouncedEventsForDeleteCover,
    setValue: setEventsForDeleteCover,
  } = useDebouncedValue<typeof coverTableProps.selectedEventsMap | null>({
    defaultValue: null,
  });

  const periods = useMemo(() => {
    const periodsLengthsPerRow =
      data?.map(({ dayInfo }) => dayInfo.periods.length) ?? [];
    const numberOfPeriods = Math.max(...periodsLengthsPerRow, 0);

    return Array.from({ length: numberOfPeriods }, (_, i) => i + 1);
  }, [data]);

  const columns = useMemo(
    () =>
      getColumnHeaders(t, userAsFirstColumn, onLinkClick, periods, isCompact, {
        ...coverTableProps,
        setEventsForApplyCover,
        setEventsForDeleteCover,
        eventIdWithContextMenuOpen,
        setEventIdWithContextMenuOpen,
      }),
    [
      t,
      userAsFirstColumn,
      onLinkClick,
      periods,
      isCompact,
      coverTableProps,
      setEventsForApplyCover,
      setEventsForDeleteCover,
      eventIdWithContextMenuOpen,
      setEventIdWithContextMenuOpen,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      sorting: [
        {
          id: userAsFirstColumn ? 'firstName' : 'date',
          desc: false,
        },
      ],
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            p: 2,
          }}
        >
          <Box
            sx={{
              gridColumn: '2 / 2',
              justifySelf: 'center',
            }}
          >
            {datepicker}
          </Box>
          <Box
            sx={{
              gridColumn: '3 / 3',
              justifySelf: 'end',
              alignSelf: 'center',
            }}
          >
            <ActionMenu
              menuItems={[
                {
                  label: t('common:actions.print'),
                  icon: <PrinterIcon />,
                  onClick: () => window.print(),
                },
              ]}
            />
          </Box>
        </Box>
        <EmptyStateContainer isEmpty={!data?.length} isLoading={isLoading}>
          <TableContainer>
            <Table
              stickyHeader
              sx={({ palette }) => ({
                width: table.getTotalSize(),
                tableLayout: 'fixed',
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
                  position: 'relative',
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
                '& .resizer': {
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: '5px',
                  cursor: 'col-resize',
                  userSelect: 'none',
                  touchAction: 'none',
                },
                '& .cursor-pointer': {
                  cursor: 'pointer',
                },
              })}
            >
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        component="th"
                        sx={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <Box
                            className={
                              header.column.getCanSort() ? 'cursor-pointer' : ''
                            }
                            role="presentation"
                            onClick={header.column.getToggleSortingHandler()}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              width: '100%',
                              gap: 0.5,
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <ArrowRightIcon
                                sx={{
                                  width: 16,
                                  height: 16,
                                  transform:
                                    header.column.getIsSorted() === 'desc'
                                      ? 'rotate(90deg)'
                                      : 'rotate(-90deg)',
                                }}
                              />
                            )}
                          </Box>
                        )}
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? 'isResizing' : ''
                          }`}
                          role="presentation"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        sx={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </EmptyStateContainer>
      </Card>
      <ApplyCoverModal
        open={!!eventsForApplyCover}
        onClose={() => {
          setEventsForApplyCover(null);
        }}
        eventsMap={eventsForApplyCover ?? debouncedEventsForApplyCover}
      />
      <RemoveCoverModal
        open={!!eventsForDeleteCover}
        onClose={() => {
          setEventsForDeleteCover(null);
        }}
        eventsMap={eventsForDeleteCover ?? debouncedEventsForDeleteCover}
      />
    </>
  );
}
