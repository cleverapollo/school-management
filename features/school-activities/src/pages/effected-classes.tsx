import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  getNumber,
  usePreferredNameLayout,
  ActionMenu,
  ConfirmDialog,
  useDebouncedValue,
  useNumber,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useParams } from 'react-router';
import { useClassAway, ReturnTypeFromUseClassAway } from '../api/class-away';
import {
  useLessonsNeedingCover,
  ReturnTypeFromUseLessonsNeedingCover,
} from '../api/lessons-needed-cover';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<
    ('common' | 'schoolActivities')[],
    undefined,
    ('common' | 'schoolActivities')[]
  >,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseClassAway>['columnDefs'] => [
  {
    headerName: t('common:time'),
    field: 'event',
    valueGetter: ({ data }) => data?.event,
    valueFormatter: ({ data }) =>
      data?.event?.startTime && data?.event?.endTime
        ? `${data?.event?.startTime} - ${data?.event?.endTime}`
        : '-',
    enableRowGroup: true,
  },
  {
    headerName: t('schoolActivities:subjectGroup'),
    field: 'event.name',
    valueGetter: ({ data }) => data?.event?.name || '-',
  },
  {
    headerName: t('common:room', { count: 1 }),
    field: 'event.rooms',
    valueGetter: ({ data }) => data?.event?.rooms,
  },
  {
    headerName: t('schoolActivities:studentsOnActivity'),
    colId: 'studentsOnActivity',
    valueGetter: ({ data }) => data?.studentsAttendingActivityTotal || '-',
    valueFormatter: ({ data }) =>
      data?.studentsAttendingActivityTotal && data?.studentsInGroupTotal
        ? `${data?.studentsAttendingActivityTotal}/${data?.studentsInGroupTotal}`
        : '-',
  },
  {
    headerName: t('common:teacher'),
    field: 'freeStaff',
    valueGetter: ({ data }) => data?.freeStaff || '-',
    valueFormatter: ({ data }) => displayNames(data?.freeStaff),
  },
  // ** NOT SURE WHAT THE FIELD IS TO DISPLAY THIS DATA **
  // {
  //   headerName: 'Windfall',
  //   colId: 'windfall',
  //   valueGetter: ({ data }) => data?.event?.lessonInfo?. || '-',
  // },
];

const getColumnsForCoverRequired = (
  t: TFunction<
    ('common' | 'schoolActivities')[],
    undefined,
    ('common' | 'schoolActivities')[]
  >,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseLessonsNeedingCover>['columnDefs'] => [
  {
    headerName: t('common:time'),
    colId: 'time',
    valueGetter: ({ data }) => data?.event,
    valueFormatter: ({ data }) =>
      data?.event?.startTime && data?.event?.endTime
        ? `${data?.event?.startTime} - ${data?.event?.endTime}`
        : '-',
    enableRowGroup: true,
  },
  {
    headerName: t('schoolActivities:subjectGroup'),
    field: 'event.name',
    valueGetter: ({ data }) => data?.event?.name,
  },
  {
    headerName: t('common:room', { count: 1 }),
    colId: 'room',
    valueGetter: ({ data }) => data?.event?.rooms,
  },
  {
    headerName: t('common:teacher'),
    field: 'awayStaff',
    valueGetter: ({ data }) => data?.awayStaff,
    valueFormatter: ({ data }) =>
      data?.awayStaff ? displayNames(data?.awayStaff) : '-',
  },
  {
    headerName: t('schoolActivities:studentsRemaining'),
    colId: 'studentsRemaining',
    valueGetter: ({ data }) => data?.studentsAttendingActivityTotal,
    valueFormatter: ({ data }) =>
      data?.studentsAttendingActivityTotal && data?.studentsInGroupTotal
        ? `${data?.studentsAttendingActivityTotal}/${data?.studentsInGroupTotal}`
        : '-',
  },
];

type TabsType = { id: number; name: string; colour: string };
type TabValueType = TabsType['name'] | 'All';

export default function EffectedClasses() {
  const { activityId } = useParams();
  const schoolActivityNumber = useNumber(activityId);
  const { t } = useTranslation(['common', 'people']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const [value, setValue] = useState(0);
  const [currentTabValue, setCurrentTabValue] = useState<TabValueType>('All');

  const { data: classAwayData } = useClassAway({
    schoolActivityId: schoolActivityNumber ?? 0,
  });
  const { data: lessonsNeededCover } = useLessonsNeedingCover({
    schoolActivityId: schoolActivityNumber ?? 0,
  });

  const [currentTableData, setCurrentTableData] = useState(lessonsNeededCover);

  const columns = useMemo(() => getColumns(t, displayNames), [t, displayNames]);
  const coverRequiredColumns = useMemo(
    () => getColumnsForCoverRequired(t, displayNames),
    [t, displayNames]
  );

  const tabs: TabsType[] = [
    { id: 1, name: 'Cover required', colour: 'indigo' },
    { id: 2, name: 'Class away', colour: 'slate' },
  ];

  return (
    <Card
      sx={{
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'indigo.50',
        padding: '18px',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 0,
        }}
      >
        <Tabs
          value={value}
          onChange={(_event, newValue: number) => setValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Label"
          sx={{
            '& .MuiTabs-flexContainer': {
              alignItems: 'center',
              marginLeft: 2,
            },
            '& .MuiTabs-flexContainer > .MuiButtonBase-root': {
              marginRight: 3.5,
            },
          }}
        >
          {tabs?.map((tab) => {
            const lessonsNeededCoverTotal = lessonsNeededCover?.length ?? 0;
            const classAwayTotal = classAwayData?.length ?? 0;
            const total =
              value === 0 ? lessonsNeededCoverTotal : classAwayTotal;

            return (
              <Tab
                key={tab?.id}
                onClick={() => setCurrentTabValue(tab?.name ?? '')}
                label={
                  <>
                    <Chip
                      label={tab?.name === 'All' ? '2' : total}
                      variant="soft"
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: `${tab?.colour ?? 'indigo'}.100`,
                        borderRadius: '6px',
                        height: '20px',
                        fontWeight: '700',
                        fontSize: '12px',
                        paddingX: '8px',
                        color: `${tab?.colour ?? 'indigo'}.500`,
                        '& .MuiChip-icon': {
                          color: `${tab?.colour ?? 'indigo'}.500` ?? '',
                        },
                        '& .MuiChip-label': {
                          padding: 0,
                        },
                      }}
                    />
                    <Typography
                      color="#637381"
                      marginLeft={1}
                      sx={{
                        fontWeight: '600',
                        fontSize: '14px',
                        textWrap: 'nowrap',
                        textTransform: 'none',
                      }}
                    >
                      {tab?.name}
                    </Typography>
                  </>
                }
              />
            );
          })}
        </Tabs>
        <Stack flex={1}>
          <Table
            isLoading={false}
            // @ts-ignore
            rowData={(value === 0 ? lessonsNeededCover : classAwayData) ?? []}
            // @ts-ignore
            columnDefs={value === 0 ? columns : coverRequiredColumns}
            getRowId={({ data }) => String(data?.studentsInGroupTotal ?? 0)}
            sx={{
              height: '100%',
              boxShadow: 'none',
              p: 0,
              '& .MuiStack-root': { paddingX: 0 },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
