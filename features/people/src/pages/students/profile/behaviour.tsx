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
  Colour,
  Notes_BehaviourType,
  Notes_StudentBehaviour,
  Notes_Tag,
  usePermissions,
} from '@tyro/api';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  getNumber,
  usePreferredNameLayout,
  ActionMenu,
  useDebouncedValue,
  commonActionMenuProps,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  useStudentBehaviour,
  useBehaviourCategories,
  ReturnTypeFromUseStudentBehaviour,
} from '../../../api/behaviour/student-behaviour';
import { useBehaviourLevels } from '../../../api/behaviour/behaviour-levels';
import {
  CreateBehaviourModal,
  CreateBehaviourModalProps,
} from '../../../components/behaviour/create-behaviour-modal';
import { CategoriesContainer } from '../../../components/students/behaviour-individual-view/categories-container';
import { ReturnTypeFromUseBehaviours } from '../../../api/behaviour/list';
import { useStudent } from '../../../api/student/students';
import { CategoryTagButton } from '../../../components/behaviour/category-tab-button';
import { useBehaviourLevelByName } from '../../../hooks/use-level-by-name';
import { ConfirmDeleteBehaviour } from '../../../components/behaviour/confirm-delete-behaviour';

dayjs.extend(LocalizedFormat);

type DeleteNoteIdType = Notes_StudentBehaviour['noteId'] | null | undefined;

export type Acc = { details?: string };

export type ExtendedNotesTagType = (Notes_Tag & { colour: Colour })[];

export type TabValueType = Notes_Tag['name'] | 'All';

type SubCategoriesWithoutCategoryIdsType = {
  id: number | undefined;
  name: string | null | undefined;
  colour: string;
};

const getStudentBehaviourColumns = (
  onClickEdit: Dispatch<
    SetStateAction<CreateBehaviourModalProps['initialState']>
  >,
  t: TFunction<('common' | 'people')[], undefined, ('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onDelete: Dispatch<SetStateAction<DeleteNoteIdType>>,
  getBehaviourLevelByName: ReturnType<
    typeof useBehaviourLevelByName
  >['getBehaviourLevelByName']
): GridOptions<ReturnTypeFromUseStudentBehaviour>['columnDefs'] => [
  {
    field: 'incidentDate',
    headerName: t('common:date'),
    valueFormatter: ({ data }) => dayjs(data?.incidentDate).format('lll'),
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'category',
    headerName: t('people:category'),
    valueGetter: ({ data }) => data?.category || '-',
  },
  {
    field: 'tags',
    headerName: t('people:tags'),
    autoHeight: true,
    wrapText: true,
    width: 250,
    valueGetter: ({ data }) => data?.tags?.map((tag) => tag?.name) ?? '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentBehaviour>) => {
      const { colour } = getBehaviourLevelByName(data?.category ?? '') ?? {
        colour: 'slate',
      };

      return (
        <Stack gap={1} my={1} direction="row" flexWrap="wrap">
          {data?.tags?.map((tag) => (
            <Chip
              size="small"
              key={tag?.id}
              label={tag?.name}
              variant="soft"
              color={colour}
            />
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
    width: 250,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'associatedParties',
    headerName: t('people:association'),
    autoHeight: true,
    wrapText: true,
    width: 200,
    valueGetter: ({ data }) => {
      const subjects = data?.associatedParties?.flatMap((group) => {
        if (group?.__typename === 'SubjectGroup') {
          const [subject] = group.subjects || [];
          return subject?.name;
        }
        return [];
      });

      return subjects && subjects.length > 0 ? subjects.join(', ') : '-';
    },
  },
  {
    field: 'takenBy',
    suppressSizeToFit: true,
    headerName: t('common:createdBy'),
    valueGetter: ({ data }) => displayName(data?.takenBy) || '-',
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentBehaviour>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data?.noteId),
            },
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

export default function StudentProfileBehaviourPage() {
  const { t } = useTranslation(['common', 'people']);
  const { isStaffUserWithPermission } = usePermissions();
  const { displayName } = usePreferredNameLayout();
  const { id } = useParams();
  const studentId = getNumber(id) ?? 0;

  const [value, setValue] = useState(0);
  const [currentTabValue, setCurrentTabValue] = useState<TabValueType>('All');
  const {
    value: editBehaviours,
    setValue: setEditBehaviours,
    debouncedValue: debouncedEditConditions,
  } = useDebouncedValue<CreateBehaviourModalProps['initialState']>({
    defaultValue: null,
  });
  const [behaviourType, setBehaviourType] = useState(
    Notes_BehaviourType.Positive
  );
  const [behaviourIdToDelete, setBehaviourIdToDelete] =
    useState<ReturnTypeFromUseBehaviours['id']>(null);

  const { getBehaviourLevelByName } = useBehaviourLevelByName();
  const { data: student } = useStudent(studentId);
  const { data: studentBehaviorData, isLoading: isBehavioursLoading } =
    useStudentBehaviour({
      partyIds: [studentId],
      behaviourType,
    });

  const filteredData = useMemo(() => {
    const allBehaviourData = studentBehaviorData ?? [];
    return currentTabValue === 'All'
      ? allBehaviourData
      : allBehaviourData.filter((item) =>
          item?.tags?.some((tag) => tag?.name === currentTabValue)
        );
  }, [studentBehaviorData, currentTabValue]);

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useBehaviourCategories({
      partyIds: [studentId],
      behaviourType,
    });

  const { data: behaviourCategories = [] } = useBehaviourLevels({});

  const behaviorCategoryIds = categories?.map(
    (category) => category?.behaviourCategoryId
  );

  const tags = studentBehaviorData?.flatMap((data) => data?.tags);

  const subCategories = behaviourCategories?.flatMap((category) =>
    behaviorCategoryIds?.includes(category?.behaviourCategoryId)
      ? category?.tags?.map((tag) => ({
          id: tag?.id,
          name: tag?.name,
          colour: category.colour,
        }))
      : []
  );

  const subCategoriesWithCategoryIds =
    studentBehaviorData
      ?.filter((item) => !item?.category)
      ?.map((data) => ({
        id: data?.noteId,
        name: data?.tags && data?.tags[0]?.name,
        colour: 'grey',
      })) || [];

  const subCategoriesWithoutCategoryIds: SubCategoriesWithoutCategoryIdsType[] =
    subCategoriesWithCategoryIds?.reduce<SubCategoriesWithoutCategoryIdsType[]>(
      (acc, current) => {
        const tagName = current?.name;
        const isTagNameAlreadyIncluded = acc.some(
          (item) => item?.name === tagName
        );

        if (!isTagNameAlreadyIncluded) {
          acc.push(current);
        }

        return acc;
      },
      []
    );

  const studentBehaviourColumns = useMemo(
    () =>
      getStudentBehaviourColumns(
        setEditBehaviours,
        t,
        displayName,
        setBehaviourIdToDelete,
        getBehaviourLevelByName
      ),
    [setEditBehaviours, t, displayName, behaviourCategories]
  );

  const loadingStatus = isCategoriesLoading || isBehavioursLoading;

  const allTabs = [
    {
      id: 'All',
      colour: 'indigo',
      name: 'All',
    },
    ...subCategories,
    ...subCategoriesWithoutCategoryIds,
  ];

  const getBehaviourTypesTotals = (tabValue?: string) =>
    tags?.filter((tag) => tag?.name === tabValue).length;

  useEffect(() => {
    setCurrentTabValue('All');
    setValue(0);
  }, [behaviourType]);

  const handleAddCondition = () => {
    setEditBehaviours({
      students: student ? [student.person] : [],
    });
  };

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
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 3,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1}>
            <CategoryTagButton
              onClick={() => {
                setBehaviourType(Notes_BehaviourType.Positive);
              }}
              dotColor="green.400"
              isActive={behaviourType === Notes_BehaviourType.Positive}
              label={t('common:behaviourType.POSITIVE')}
            />
            <CategoryTagButton
              onClick={() => {
                setBehaviourType(Notes_BehaviourType.Negative);
              }}
              dotColor="red.500"
              isActive={behaviourType === Notes_BehaviourType.Negative}
              label={t('common:behaviourType.NEGATIVE')}
            />
            <CategoryTagButton
              onClick={() => {
                setBehaviourType(Notes_BehaviourType.Neutral);
              }}
              dotColor="blue.500"
              isActive={behaviourType === Notes_BehaviourType.Neutral}
              label={t('common:behaviourType.NEUTRAL')}
            />
          </Stack>
        </Box>

        {isStaffUserWithPermission('ps:1:notes:write_behaviour') && (
          <Button
            variant="contained"
            onClick={handleAddCondition}
            startIcon={<AddIcon />}
          >
            {t('people:actions.createBehaviour')}
          </Button>
        )}
      </Stack>

      {loadingStatus ? (
        <Stack minHeight="40vh" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 0,
          }}
        >
          <CategoriesContainer
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
            }}
          >
            {allTabs?.map((tab) => {
              const total = getBehaviourTypesTotals(tab?.name ?? '');
              if (total !== 0 || tab?.name === 'All') {
                return (
                  <Tab
                    key={tab?.id}
                    onClick={() => setCurrentTabValue(tab?.name ?? '')}
                    label={
                      <>
                        <Chip
                          label={
                            tab?.name === 'All'
                              ? studentBehaviorData?.length
                              : total
                          }
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
              }
              return null;
            })}
          </Tabs>
          <Stack flex={1}>
            <Table
              isLoading={isBehavioursLoading}
              rowData={filteredData}
              columnDefs={studentBehaviourColumns}
              getRowId={({ data }) => String(data?.noteId ?? 0)}
              sx={{
                height: '100%',
                boxShadow: 'none',
                p: 0,
                '& .MuiStack-root': { paddingX: 0 },
              }}
            />
          </Stack>
        </CardContent>
      )}

      <CreateBehaviourModal
        open={!!editBehaviours}
        onClose={() => setEditBehaviours(null)}
        initialState={editBehaviours || debouncedEditConditions}
        behaviourType={behaviourType}
        setBehaviourType={setBehaviourType}
      />

      <ConfirmDeleteBehaviour
        idToDelete={behaviourIdToDelete}
        onClose={() => setBehaviourIdToDelete(null)}
      />
    </Card>
  );
}
