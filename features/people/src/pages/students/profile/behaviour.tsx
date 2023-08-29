import { Box, Button, Chip, Stack } from '@mui/material';
import { getColorBasedOnIndex, usePermissions } from '@tyro/api';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  getNumber,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { AddIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  ReturnTypeFromUseBehaviours,
  useBehaviours,
} from '../../../api/behaviour/list';
import {
  CreateBehaviourModal,
  CreateBehaviourModalProps,
} from '../../../components/behaviour/create-behaviour-modal';

dayjs.extend(LocalizedFormat);

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseBehaviours>['columnDefs'] => [
  {
    field: 'incidentDate',
    headerName: t('common:date'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) => dayjs(data?.incidentDate).format('ll LT'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'associatedGroups',
    headerName: t('common:subjects'),
    autoHeight: true,
    wrapText: true,
    width: 300,
    valueGetter: ({ data }) =>
      data?.associatedGroups?.flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          const [subject] = group.subjects || [];
          return subject?.name;
        }
        return [];
      }),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) => {
      const subjects = data?.associatedGroups?.flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          return { partyId: group.partyId, ...group.subjects[0] };
        }
        return [];
      });

      return (
        <Stack gap={1} direction="row" flexWrap="wrap">
          {subjects?.map((subject, index) => (
            <Chip
              size="small"
              variant="soft"
              key={subject?.partyId}
              label={subject?.name}
              color={subject?.colour || getColorBasedOnIndex(index)}
            />
          ))}
        </Stack>
      );
    },
  },
  {
    field: 'behaviour',
    headerName: t('people:behaviour'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) => data?.tags[0]?.name || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) => (
      <Stack gap={1} direction="row" flexWrap="wrap">
        {data?.tags.map(({ id, name }) => (
          <Chip
            key={id}
            label={name}
            variant="soft"
            color={getColorBasedOnIndex(id)}
          />
        ))}
      </Stack>
    ),
  },
  {
    field: 'note',
    headerName: t('common:details'),
    autoHeight: true,
    wrapText: true,
    width: 400,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'createdByPerson',
    suppressSizeToFit: true,
    headerName: t('common:takenBy'),
    valueGetter: ({ data }) =>
      data ? displayName(data.createdByPerson) : null,
  },
];

export default function StudentProfileBehaviourPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const [behaviourDetails, setBehaviourDetails] =
    useState<CreateBehaviourModalProps['initialState']>();
  const { t } = useTranslation(['common', 'people']);
  const { isStaffUser } = usePermissions();
  const { displayName } = usePreferredNameLayout();
  const { data: behaviours = [], isLoading: isBehavioursLoading } =
    useBehaviours(studentId);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t, displayName),
    [t, displayName]
  );

  return (
    <>
      {isStaffUser && (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => setBehaviourDetails({})}
            startIcon={<AddIcon />}
          >
            {t('people:actions.createBehaviour')}
          </Button>
        </Box>
      )}

      <Table
        isLoading={isBehavioursLoading}
        rowData={behaviours ?? []}
        columnDefs={studentBehaviourColumns}
        getRowId={({ data }) => String(data?.id)}
      />
      {behaviourDetails && (
        <CreateBehaviourModal
          studentId={studentId!}
          onClose={() => setBehaviourDetails(null)}
          initialState={behaviourDetails}
        />
      )}
    </>
  );
}
