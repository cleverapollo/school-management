import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  getColorBasedOnIndex,
  Notes_BehaviourType,
  usePermissions,
  useAcademicNamespace,
} from '@tyro/api';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  getNumber,
  usePreferredNameLayout,
  ActionMenu,
  ConfirmDialog,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { AddIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  ReturnTypeFromUseBehaviours,
  useBehaviours,
} from '../../../api/behaviour/list';
import { useNoteTagsBehaviour } from '../../../api/behaviour/behaviour-tags';
import {
  CreateBehaviourModal,
  CreateBehaviourModalProps,
} from '../../../components/behaviour/create-behaviour-modal';
import { useDeleteBehaviour } from '../../../api/behaviour/delete-behaviour';
import { OccurrenceTypesContainer } from '../../../components/students/behaviour-individual-view/occurrence-types-container';
import { TabsContainer } from '../../../components/students/behaviour-individual-view/tabs';

dayjs.extend(LocalizedFormat);

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onDelete: Dispatch<SetStateAction<ReturnTypeFromUseBehaviours['id']>>
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
    width: 200,
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
      const subjects = (data?.associatedGroups || []).flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          return { partyId: group.partyId, ...group.subjects[0] };
        }
        return [];
      });

      return subjects.length > 0 ? (
        <Stack gap={1} direction="row" flexWrap="wrap">
          {subjects.map((subject, index) => (
            <Chip
              size="small"
              variant="soft"
              key={subject?.partyId}
              label={subject?.name}
              color={subject?.colour || getColorBasedOnIndex(index)}
            />
          ))}
        </Stack>
      ) : (
        '-'
      );
    },
  },
  {
    field: 'tags',
    headerName: t('people:behaviour'),
    autoHeight: true,
    wrapText: true,
    width: 300,
    valueGetter: ({ data }) => data?.tags[0]?.name || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) =>
      (data?.tags || []).length > 0 ? (
        <Stack gap={1} my={1} direction="row" flexWrap="wrap">
          {data?.tags.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              variant="soft"
              color={getColorBasedOnIndex(id)}
            />
          ))}
        </Stack>
      ) : (
        '-'
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
    valueGetter: ({ data }) => displayName(data?.createdByPerson) || '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellClass: 'ag-show-on-row-interaction',
    sortable: false,
    suppressSizeToFit: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseBehaviours>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data.id),
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileBehaviourPage() {
  const [behaviourDetails, setBehaviourDetails] =
    useState<CreateBehaviourModalProps['initialState']>();
  const [behaviourType, setBehaviourType] = useState(
    Notes_BehaviourType.Positive
  );
  const { t } = useTranslation(['common', 'people']);
  const { isStaffUser } = usePermissions();
  const { displayName } = usePreferredNameLayout();

  const { id } = useParams();
  const studentId = getNumber(id) ?? 0;

  const { data: behaviours = [], isLoading: isBehavioursLoading } =
    useBehaviours(studentId);
  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicYear = activeAcademicNamespace?.name;

  const filteredBehaviours = behaviours?.filter(
    (item) => item.tags[0].behaviourType === behaviourType
  );
  console.log(filteredBehaviours, 'getBehavioursBasedOnType');

  const { mutateAsync: deleteBehaviour } = useDeleteBehaviour(studentId);

  const [behaviourIdToDelete, setBehaviourIdToDelete] =
    useState<ReturnTypeFromUseBehaviours['id']>(null);

  const studentBehaviourColumns = useMemo(
    () => getStudentBehaviourColumns(t, displayName, setBehaviourIdToDelete),
    [t, displayName]
  );

  const onConfirmDelete = async () => {
    await deleteBehaviour({ noteIds: [behaviourIdToDelete!] });
  };
  const { data: behaviourTags = [] } = useNoteTagsBehaviour();

  const filteredTags = behaviourTags?.filter(
    (item) => item?.behaviourType === behaviourType
  );
  const filteredTagsNames = filteredTags?.map((item) => item?.name);
  console.log(filteredTagsNames, 'filteredTagsNames');

  return (
    <Card
      sx={{
        backgroundColor: '#f9fafc',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'indigo.50',
        padding: '18px',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 3,
          marginY: 2,
        }}
      >
        <Stack direction="column">
          <CardHeader
            component="h3"
            title={t('people:behaviourTitle', { year: academicYear })}
            sx={{
              p: 0,
              border: 0,
              textAlign: 'center',
              fontWeight: 600,
              '& .MuiTypography-root': {
                fontWeight: 600,
              },
              lineHeight: '22px',
              height: '40px',
            }}
          />
          <Box>
            <Button
              onClick={() => setBehaviourType(Notes_BehaviourType.Positive)}
              sx={{
                borderRadius: 1,
                backgroundColor:
                  behaviourType === Notes_BehaviourType.Positive
                    ? 'indigo.100'
                    : ' transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor:
                  behaviourType === Notes_BehaviourType.Positive
                    ? 'indigo.500'
                    : 'grey.500',
                color:
                  behaviourType === Notes_BehaviourType.Positive
                    ? 'indigo.500'
                    : 'grey.500',
                height: '30px',
              }}
            >
              <Box
                sx={{
                  width: '9px',
                  height: '9px',
                  display: 'flex',
                  borderRadius: '50%',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'green',
                  marginRight: 1,
                }}
              />
              Positive
            </Button>
            <Button
              onClick={() => setBehaviourType(Notes_BehaviourType.Negative)}
              sx={{
                borderRadius: 1,
                backgroundColor:
                  behaviourType === Notes_BehaviourType.Negative
                    ? 'indigo.100'
                    : 'grey.100',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor:
                  behaviourType === Notes_BehaviourType.Negative
                    ? 'indigo.500'
                    : 'grey.500',
                color:
                  behaviourType === Notes_BehaviourType.Negative
                    ? 'indigo.500'
                    : 'grey.500',
                height: '30px',
                marginLeft: 2,
              }}
            >
              <Box
                sx={{
                  width: '9px',
                  height: '9px',
                  display: 'flex',
                  borderRadius: '50%',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'red',
                  marginRight: 1,
                }}
              />
              Negative
            </Button>
          </Box>
        </Stack>

        {isStaffUser && (
          <Button
            variant="contained"
            onClick={() => setBehaviourDetails({})}
            startIcon={<AddIcon />}
          >
            {t('people:actions.createBehaviour')}
          </Button>
        )}
      </Stack>

      <OccurrenceTypesContainer />

      <TabsContainer filteredTagsNames={filteredTagsNames} />
      <Table
        isLoading={isBehavioursLoading}
        rowData={filteredBehaviours ?? []}
        columnDefs={studentBehaviourColumns}
        getRowId={({ data }) => String(data?.id)}
        sx={{
          boxShadow: 'none',
          p: 0,
          '& .MuiStack-root': { paddingX: 0 },
          '& .MuiFilledInput-root': { marginX: 2 },
        }}
      />
      {behaviourDetails && (
        <CreateBehaviourModal
          studentId={studentId}
          onClose={() => setBehaviourDetails(null)}
          initialState={behaviourDetails}
        />
      )}
      {behaviourIdToDelete && (
        <ConfirmDialog
          open
          title={t('people:deleteBehaviour')}
          description={t('people:areYouSureYouWantToDeleteBehaviour')}
          confirmText={t('common:delete')}
          onClose={() => setBehaviourIdToDelete(null)}
          onConfirm={onConfirmDelete}
        />
      )}
    </Card>
  );
}
