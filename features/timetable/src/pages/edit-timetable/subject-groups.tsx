import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayNames,
  sortStartNumberFirst,
  Table,
  TableAvatar,
  useDebouncedValue,
  usePreferredNameLayout,
  commonActionMenuProps,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button, Chip, Stack, Tooltip } from '@mui/material';
import {
  ReturnTypeFromUseNoteTags,
  TableStaffMultipleAutocomplete,
} from '@tyro/people';
import {
  Tt_UpdateTimetableGroupRowInput,
  UpdateSubjectGroupInput,
} from '@tyro/api';
import { AddIcon, AddUserIcon, EditIcon, VerticalDotsIcon } from '@tyro/icons';
import { Link } from 'react-router-dom';
import {
  ReturnTypeFromUseTimetableSubjectGroups,
  useTimetableSubjectGroups,
} from '../../api/edit-timetable/subject-groups';
import { useLiveTimetableId } from '../../api/common/timetables';
import { Lesson } from '../../hooks/use-resource-table';
import { SwapTeacherRoomModal } from '../../components/edit-timetable/swap-teacher-room-modal';
import { useTtUpdateTimetableGroup } from '../../api/edit-timetable/update-group';
import { getLessonDayAndTime } from '../../utils/get-lesson-day-time';
import {
  UpsertSubjectGroupModal,
  UpsertSubjectGroupProps,
} from '../../components/edit-timetable/subject-groups/upsert-subject-group';

dayjs.extend(LocalizedFormat);

function getLessonLabels(
  lesson: ReturnTypeFromUseTimetableSubjectGroups['lessons'][number],
  displayNames: ReturnTypeDisplayNames,
  t: TFunction<
    ('common' | 'timetable')[],
    undefined,
    ('common' | 'timetable')[]
  >
) {
  const teachers = lesson.teachers.map(({ person }) => person);
  const teacherNames = displayNames(teachers, ' & ');
  const roomName = lesson.room?.name ? `${lesson.room.name} - ` : '';
  const { day, time } = getLessonDayAndTime(lesson);
  const formattedDay = day.format('ddd');
  const formattedDayTime = day && time ? `${formattedDay}, ${time}` : '';

  return {
    label: `${teacherNames} - ${roomName}${formattedDayTime}`,
    tooltip: t('timetable:lessonDetailTooltip', {
      teacher: teacherNames,
      room: lesson.room?.name ?? `(${t('common:noRoomSet')})`,
      day: formattedDay,
      time,
    }),
  };
}

const getSubjectGroupsColumns = (
  t: TFunction<
    ('common' | 'timetable')[],
    undefined,
    ('common' | 'timetable')[]
  >,
  displayNames: ReturnTypeDisplayNames,
  onLessonClick: (lesson: Lesson[]) => void,
  onClickEdit: Dispatch<SetStateAction<UpsertSubjectGroupProps['initialState']>>
): GridOptions<ReturnTypeFromUseTimetableSubjectGroups>['columnDefs'] => [
  {
    colId: 'name',
    headerName: t('common:name'),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseTimetableSubjectGroups>) => {
      const partyGroup = data?.partyGroup;
      if (!partyGroup || partyGroup.__typename !== 'SubjectGroup') return null;

      const subject = partyGroup?.subjects?.[0];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      return (
        <TableAvatar
          name={partyGroup.name ?? ''}
          to={`/groups/subject/${partyGroup.partyId ?? ''}`}
          avatarUrl={partyGroup.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
    valueGetter: ({ data }) => data?.partyGroup.name,
    comparator: sortStartNumberFirst,
    sort: 'asc',
  },
  {
    colId: 'year',
    headerName: t('common:year'),
    enableRowGroup: true,
    filter: true,
    valueGetter: ({ data }) => {
      const yearGroups =
        data?.partyGroup?.__typename === 'SubjectGroup'
          ? data.partyGroup.yearGroups
          : [];
      return yearGroups.map((year) => year.name).join(', ');
    },
  },
  {
    headerName: t('timetable:core'),
    field: 'partyGroup.studentMembershipType.classGroupName',
    filter: true,
  },
  {
    headerName: t('timetable:block'),
    field: 'partyGroup.studentMembershipType.blockId',
    filter: true,
  },
  {
    headerName: t('common:teachers'),
    field: 'teachers',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    enableRowGroup: true,
    valueFormatter: ({ data }) => displayNames(data?.teachers ?? []),
    editable: true,
    cellEditor: TableStaffMultipleAutocomplete,
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
  {
    field: 'lessons',
    valueGetter: ({ data }) =>
      data?.lessons?.map(
        (lesson) => getLessonLabels(lesson, displayNames, t).label
      ),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseTimetableSubjectGroups>) => {
      const partyGroup = data?.partyGroup;
      if (!partyGroup || partyGroup.__typename !== 'SubjectGroup') return null;

      const subject = partyGroup?.subjects?.[0];
      const color = subject?.colour ?? 'default';

      return (
        <Stack spacing={0.5} direction="row">
          {data?.lessons?.map((lesson) => {
            const { label, tooltip } = getLessonLabels(lesson, displayNames, t);

            return (
              <Tooltip
                key={JSON.stringify(lesson.id)}
                title={tooltip}
                describeChild
                enterDelay={1000}
                enterNextDelay={1000}
              >
                <Chip
                  label={label}
                  color={color}
                  variant="soft"
                  onClick={() => {
                    onLessonClick([lesson]);
                  }}
                />
              </Tooltip>
            );
          })}
          {data?.lessons?.length > 1 && (
            <Chip
              label={t('common:actions.editAll')}
              color={color}
              variant="soft"
              icon={<EditIcon />}
              onClick={() => {
                onLessonClick(data?.lessons);
              }}
            />
          )}
        </Stack>
      );
    },
    headerName: t('timetable:lessons'),
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseTimetableSubjectGroups>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
          ]}
        />
      ),
  },
];

export default function TimetableSubjectGroups() {
  const { t } = useTranslation(['timetable', 'timetable']);
  const { displayNames } = usePreferredNameLayout();
  const {
    value: openedLessonToEdit,
    debouncedValue: debouncedOpenedLessonToEdit,
    setValue: setOpenedLessonToEdit,
  } = useDebouncedValue<Lesson[] | null>({ defaultValue: null });
  const { data: liveTimetableId = 0 } = useLiveTimetableId();
  const { data: subjectGroupsData } = useTimetableSubjectGroups({
    timetableId: liveTimetableId,
  });
  const { mutateAsync: updateTimetableGroup } = useTtUpdateTimetableGroup();

  const onLessonClick = (lesson: Lesson[]) => {
    setOpenedLessonToEdit(lesson);
  };

  const [upsertSubjectGroupDetails, setUpsertSubjectGroupDetails] =
    useState<UpsertSubjectGroupProps['initialState']>(null);

  const onBulkSave = (
    changes: BulkEditedRows<ReturnTypeFromUseTimetableSubjectGroups, 'teachers'>
  ) => {
    const updates = Object.entries(changes).reduce<
      Tt_UpdateTimetableGroupRowInput[]
    >((acc, [id, { teachers }]) => {
      const newValue = teachers?.newValue ?? [];

      acc.push({
        timetableGroupPartyId: Number(id),
        teachersPartyIds: newValue.map((teacher) => teacher.partyId),
      });

      return acc;
    }, []);

    return updateTimetableGroup({
      timetableId: liveTimetableId,
      updates,
    });
  };
  const handleCreate = () => {
    // @ts-ignore
    setUpsertSubjectGroupDetails({});
  };

  const subjectGroupsColumns = useMemo(
    () =>
      getSubjectGroupsColumns(
        t,
        displayNames,
        onLessonClick,
        setUpsertSubjectGroupDetails
      ),
    [t, displayNames]
  );

  return (
    <>
      <Table
        rowData={subjectGroupsData ?? []}
        columnDefs={subjectGroupsColumns}
        getRowId={({ data }) => String(data?.partyGroup.partyId)}
        onBulkSave={onBulkSave}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreate}
              startIcon={<AddIcon />}
            >
              {t('timetable:createSubjectGroup')}
            </Button>
          </Box>
        }
      />
      <SwapTeacherRoomModal
        isOpen={!!openedLessonToEdit}
        onClose={() => setOpenedLessonToEdit(null)}
        timetableId={liveTimetableId}
        lessons={openedLessonToEdit || debouncedOpenedLessonToEdit}
      />
      <UpsertSubjectGroupModal
        isOpen={!!upsertSubjectGroupDetails}
        onClose={() => setUpsertSubjectGroupDetails(null)}
        initialState={upsertSubjectGroupDetails}
        timetableId={liveTimetableId}
      />
    </>
  );
}
