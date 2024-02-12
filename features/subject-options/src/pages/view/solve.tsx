import { LoadingButton } from '@mui/lab';
import { Button, Chip, Stack, Tooltip } from '@mui/material';
import {
  getNumber,
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  useDisclosure,
  usePreferredNameLayout,
  ValueFormatterParams,
  ValueGetterParams,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { GearIcon } from '@tyro/icons';
import { StudentTableAvatar } from '@tyro/people';
import { getPersonProfileLink } from '@tyro/api';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  ReturnTypeFromUseOptionsSetup,
  useOptionsSetup,
} from '../../api/options';
import {
  ReturnTypeFromUseOptionsSolveStudentAssignment,
  useOptionsSolveStudentAssignment,
} from '../../api/solve/student-assignment';
import { SolveSettingsModal } from '../../components/view/solve/settings-modal';

type OptionsAssignedValue = NonNullable<
  ReturnTypeFromUseOptionsSolveStudentAssignment['students']['subjectGroupsAssigned'][number]['teachingGroup']
>;

type StudentRow = {
  student: NonNullable<ReturnTypeFromUseOptionsSetup['students']>[number];
  missedPreferences: number;
  optionsAssigned: Map<string, OptionsAssignedValue>;
};

const getStudentRows = (
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  studentAssignments:
    | ReturnTypeFromUseOptionsSolveStudentAssignment[]
    | undefined
): StudentRow[] => {
  const studentsOptionsAssigned = new Map<
    number,
    Map<string, OptionsAssignedValue>
  >();
  const studentMissingPreferences = new Map<number, number>();

  studentAssignments?.forEach(({ students }) => {
    const { student, subjectGroupsAssigned, missedPreferences } = students;
    if (student) {
      const currentStudentsOptionsAssigned = subjectGroupsAssigned.reduce<
        Map<string, OptionsAssignedValue>
      >((acc, { subjectSetIdx, preferenceNumber, teachingGroup }) => {
        if (subjectSetIdx && preferenceNumber && teachingGroup) {
          acc.set(`${subjectSetIdx}-${preferenceNumber}`, teachingGroup);
        }
        return acc;
      }, new Map());
      studentMissingPreferences.set(student.partyId, missedPreferences);
      studentsOptionsAssigned.set(
        student.partyId,
        currentStudentsOptionsAssigned
      );
    }
  });

  return (optionsSetup?.students ?? []).map((student) => ({
    student,
    missedPreferences: studentMissingPreferences.get(student.partyId) ?? 0,
    optionsAssigned: studentsOptionsAssigned.get(student.partyId) ?? new Map(),
  }));
};

const getStudentAssignmentColumns = (
  t: TFunction<
    ('common' | 'subjectOptions')[],
    undefined,
    ('common' | 'subjectOptions')[]
  >,
  displayName: ReturnTypeDisplayName,
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined
): GridOptions<StudentRow>['columnDefs'] => [
  {
    colId: 'student',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.student),
    cellRenderer: ({ data }: ICellRendererParams<StudentRow, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student}
          to={getPersonProfileLink(data?.student)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    filter: true,
    pinned: 'left',
  },
  {
    field: 'missedPreferences',
    headerName: t('subjectOptions:prefsMissed'),
  },
  ...(optionsSetup?.subjectSets?.map((subjectSet) => ({
    colId: JSON.stringify(subjectSet.id),
    headerName: subjectSet.name,
    headerClass: subjectSet.id.idx !== 1 ? 'border-left' : undefined,
    children: Array.from(Array(subjectSet.mustGet)).map((_, index) => {
      const preferenceIdx = index + 1;
      const colId = `${subjectSet.id.idx}-${preferenceIdx}`;
      const showLeftBorder = preferenceIdx === 1 && subjectSet.id.idx !== 1;

      return {
        field: `choices.${colId}`,
        headerName: t('subjectOptions:prefX', { x: preferenceIdx }),
        cellClass: [showLeftBorder && 'border-left'].filter(Boolean),
        headerClass: [showLeftBorder && 'border-left'].filter(Boolean),
        valueGetter: ({ data }: ValueGetterParams<StudentRow, any>) =>
          data?.optionsAssigned.get(colId),
        cellRenderer: ({
          value,
        }: ICellRendererParams<
          StudentRow,
          ReturnType<StudentRow['optionsAssigned']['get']>
        >) => {
          if (!value) return '-';

          const { name, subject } = value;

          return (
            <Chip
              size="small"
              variant="soft"
              color={subject.colour ?? 'slate'}
              label={name}
            />
          );
        },
        valueFormatter: ({
          value,
        }: ValueFormatterParams<
          StudentRow,
          ReturnType<StudentRow['optionsAssigned']['get']>
        >) => value?.subject?.name ?? '-',
      };
    }),
  })) ?? []),
];

export default function StudentOptionsSolvePage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation(['common', 'subjectOptions']);
  const { displayName } = usePreferredNameLayout();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: optionsSetup } = useOptionsSetup(optionId);
  const { data: studentAssignments } = useOptionsSolveStudentAssignment({
    ids: [optionId],
  });

  const studentRows = useMemo(
    () => getStudentRows(optionsSetup, studentAssignments),
    [optionsSetup, studentAssignments]
  );

  const studentAssignmentColumns = useMemo(
    () => getStudentAssignmentColumns(t, displayName, optionsSetup),
    [t, displayName, optionsSetup]
  );

  console.log({ studentAssignments });

  return (
    <>
      <Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onOpen} variant="outlined" endIcon={<GearIcon />}>
            {t('subjectOptions:solverSettings')}
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => {
              console.log('Solve');
            }}
          >
            {t('common:solve')}
          </LoadingButton>
        </Stack>
        <Table
          sx={{
            '& .outside-get': {
              backgroundColor: 'slate.100',
            },
            '& .border-left': {
              borderLeft: '1px solid',
              borderLeftColor: 'slate.200',
            },
          }}
          rowData={studentRows}
          columnDefs={studentAssignmentColumns}
          getRowId={({ data }) => JSON.stringify(data?.student?.partyId)}
        />
      </Stack>
      <SolveSettingsModal
        optionsId={optionId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
