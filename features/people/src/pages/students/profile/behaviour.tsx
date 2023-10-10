import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import MyChip from '@mui/material/Chip';
import {
  Colour,
  Notes_BehaviourType,
  Notes_StudentBehaviour,
  Notes_Tag,
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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  useIndividualStudentBehaviour,
  useBehaviourCategories,
  ReturnTypeFromUseIndividualStudentBehaviour,
  ReturnTypeFromBehaviourCategories,
} from '../../../api/behaviour/individual-student-behaviour';
import {
  useBehaviourLevels,
  ReturnTypeFromUseBehaviourLevels,
} from '../../../api/behaviour/behaviour-levels';
import {
  CreateBehaviourModal,
  CreateBehaviourModalProps,
} from '../../../components/behaviour/create-behaviour-modal';
import { useDeleteBehaviour } from '../../../api/behaviour/delete-behaviour';
import { BehaviourLevelsContainer } from '../../../components/students/behaviour-individual-view/occurrence-types-container';

dayjs.extend(LocalizedFormat);

type DeleteNoteIdType = Notes_StudentBehaviour['noteId'] | null | undefined;

type Tags = {
  colour: Colour | undefined;
  tags?: Array<Pick<Notes_Tag, 'name' | 'id'>>;
};

export type Acc = { details?: string };

export type ExtendedNotesTagType = (Notes_Tag & { colour: Colour })[];

export type TabValueType = Notes_Tag['name'] | 'All'; // Pick<Notes_Tag, 'name'> | 'All';

const getStudentBehaviourColumns = (
  t: TFunction<('common' | 'people')[], undefined, ('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onDelete: Dispatch<SetStateAction<DeleteNoteIdType>>,
  getTagsForCategory: (arg0: string) => Tags
): GridOptions<ReturnTypeFromUseIndividualStudentBehaviour>['columnDefs'] => [
  {
    field: 'incidentDate',
    headerName: t('common:date'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) => dayjs(data?.incidentDate).format('ll'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'associatedParties',
    headerName: t('people:association'),
    autoHeight: true,
    wrapText: true,
    width: 400,
    valueGetter: ({ data }) =>
      data?.associatedParties?.flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          const [subject] = group.subjects || [];
          return subject?.name;
        }
        return [];
      }),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseIndividualStudentBehaviour>) => {
      const subjects = (data?.associatedParties || []).flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          return { partyId: group.partyId, ...group.subjects[0] };
        }
        return [];
      });

      return subjects.length > 0 ? (
        <Stack gap={1} direction="row" flexWrap="wrap">
          {subjects.map((subject) => (
            <Typography
              variant="body2"
              key={subject?.partyId}
              color="#000000"
              fontWeight={600}
            >
              {subject?.name}
            </Typography>
          ))}
        </Stack>
      ) : (
        '-'
      );
    },
  },
  {
    colId: 'tags',
    headerName: t('people:behaviour'),
    autoHeight: true,
    wrapText: true,
    width: 350,
    valueGetter: ({ data }) => {
      if (!data?.category) {
        return '-';
      }

      return getTagsForCategory(data.category)?.tags?.map((tag) => tag?.name);
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseIndividualStudentBehaviour>) => {
      if (!data?.category) {
        return '-';
      }
      const { colour, tags } = getTagsForCategory(data?.category);

      return (
        <Stack gap={1} my={1} direction="row" flexWrap="wrap">
          {tags?.map(({ id, name }) => (
            <Chip key={id} label={name} variant="soft" color={colour} />
          ))}
        </Stack>
      );
    },
  },
  {
    field: 'details',
    headerName: t('common:details'),
    autoHeight: true,
    wrapText: true,
    width: 300,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'takenBy',
    suppressSizeToFit: true,
    headerName: t('common:takenBy'),
    valueGetter: ({ data }) => displayName(data?.takenBy) || '-',
  },
  {
    field: 'category',
    suppressSizeToFit: true,
    headerName: 'Level',
    valueGetter: ({ data }) => data?.category || '-',
  },
  {
    suppressColumnsToolPanel: true,
    cellClass: 'ag-show-on-row-interaction',
    sortable: false,
    suppressSizeToFit: true,
    cellRenderer: ({ data }: ICellRendererParams<DeleteNoteIdType>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              // @ts-ignore
              onClick: () => onDelete(data?.noteId as DeleteNoteIdType),
            },
          ]}
        />
      ),
  },
];

const getTagsForCategory = (
  categoryName: string,
  behaviourCategories: ReturnTypeFromUseBehaviourLevels
): Tags => {
  const category = behaviourCategories.find((obj) => obj.name === categoryName);
  const tags = category?.tags?.map((tag) => ({
    id: tag?.id,
    name: tag?.name,
  }));

  const tagData = {
    colour: category?.colour,
    tags,
  };

  return tagData;
};

export default function StudentProfileBehaviourPage() {
  const { t } = useTranslation(['common', 'people']);
  const { isStaffUser } = usePermissions();
  const { displayName } = usePreferredNameLayout();
  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicYear = activeAcademicNamespace?.name;
  const { id } = useParams();
  const studentId = getNumber(id) ?? 0;

  const [value, setValue] = useState(0);
  const [currentTabValue, setCurrentTabValue] = useState<TabValueType>('All');
  const [behaviourDetails, setBehaviourDetails] =
    useState<CreateBehaviourModalProps['initialState']>();
  const [behaviourType, setBehaviourType] = useState(
    Notes_BehaviourType.Positive
  );
  const [behaviourIdToDelete, setBehaviourIdToDelete] =
    useState<DeleteNoteIdType>(null);

  const { data: studentBehaviorData, isLoading: isBehavioursLoading } =
    useIndividualStudentBehaviour({
      partyId: studentId,
      behaviourType,
    });

  const [filteredData, setFilteredData] = useState(studentBehaviorData ?? []);

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useBehaviourCategories({
      partyId: studentId,
      behaviourType,
    });

  const { data: behaviourCategories = [] } = useBehaviourLevels({});

  const behaviorCategoryIds = categories?.map(
    (category) => category?.behaviourCategoryId
  );

  const subCategories = behaviourCategories?.flatMap((category) =>
    behaviorCategoryIds?.includes(category?.behaviourCategoryId)
      ? category?.tags.map((tag) => ({
          ...tag,
          colour: category.colour,
        }))
      : []
  );

  const { mutateAsync: deleteBehaviour } = useDeleteBehaviour(studentId);

  const onConfirmDelete = async () => {
    await deleteBehaviour({ noteIds: [behaviourIdToDelete!] });
  };

  const studentBehaviourColumns = useMemo(
    () =>
      getStudentBehaviourColumns(
        t,
        displayName,
        setBehaviourIdToDelete,
        (categoryName) => getTagsForCategory(categoryName, behaviourCategories)
      ),
    [t, displayName, behaviourCategories]
  );

  const loadingStatus = isCategoriesLoading || isBehavioursLoading;

  const allTabs = [
    {
      id: 'All',
      colour: 'indigo',
      name: 'All',
    },
    ...subCategories,
  ];

  useEffect(() => {
    if (currentTabValue === 'All') {
      setFilteredData(studentBehaviorData ?? []);
    } else {
      setFilteredData(
        (studentBehaviorData ?? []).filter((item) => {
          const { tags } = getTagsForCategory(
            item?.category ?? '',
            behaviourCategories
          );
          return tags?.some((tag) => tag.name === currentTabValue);
        })
      );
    }
  }, [studentBehaviorData, currentTabValue]);

  const getBehaviourCount = (tabValue: string) =>
    filteredData?.reduce((count, item) => {
      const behaviours = item?.category
        ? getTagsForCategory(item?.category, behaviourCategories).tags
        : [];
      const behaviourNames = behaviours?.map((behaviour) => behaviour.name);
      return count + (behaviourNames?.includes(tabValue) ? 1 : 0);
    }, 0);

  return loadingStatus ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Card
      sx={{
        backgroundColor: '#ffffff',
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
          marginBottom: 3,
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
                    ? 'indigo.50'
                    : ' transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor:
                  behaviourType === Notes_BehaviourType.Positive
                    ? 'indigo.500'
                    : 'slate.300',
                color:
                  behaviourType === Notes_BehaviourType.Positive
                    ? 'indigo.500'
                    : 'slate.400',
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
                  backgroundColor: 'green.400',
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
                    : 'slate.300',
                color:
                  behaviourType === Notes_BehaviourType.Negative
                    ? 'indigo.500'
                    : 'slate.400',
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
                  backgroundColor: 'red.500',
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

      <BehaviourLevelsContainer
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
      />

      <Tabs
        value={value}
        onChange={(_event, newValue: number) => setValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label={t('people:ariaLabelForTabs')}
        sx={{
          '& .MuiTabs-flexContainer': {
            alignItems: 'center',
            marginLeft: 2,
          },
          '& .MuiTabs-flexContainer > .MuiButtonBase-root': {
            marginRight: 3.5,
          },
          '& .MuiTabScrollButton-horizontal': {
            display: 'none',
          },
        }}
      >
        {allTabs?.map((tab) => (
          <Tab
            key={tab.id}
            onClick={() => setCurrentTabValue(tab?.name)}
            label={
              <>
                <MyChip
                  label={
                    tab?.name === 'All'
                      ? subCategories?.length
                      : getBehaviourCount(tab?.name)
                  }
                  variant="soft"
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: `${tab?.colour}.100`,
                    borderRadius: '6px',
                    height: '20px',
                    fontWeight: '700',
                    fontSize: '12px',
                    paddingX: '8px',
                    color: `${tab?.colour}.500`,
                    '& .MuiChip-icon': {
                      color: `${tab?.colour}.500`,
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
        ))}
      </Tabs>

      <Table
        isLoading={isBehavioursLoading}
        rowData={filteredData}
        columnDefs={studentBehaviourColumns}
        getRowId={({ data }) => String(data?.noteId)}
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
