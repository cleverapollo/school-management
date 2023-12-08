import {
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnOfUseToast,
  ReturnTypeDisplayName,
  StudyLevelSelectCellEditor,
  Table,
  TableSelect,
  TableStudyLevelChip,
  TableSwitch,
  TableBooleanValue,
  useNumber,
  usePreferredNameLayout,
  useToast,
  ValueSetterParams,
  ValueFormatterParams,
} from '@tyro/core';
import {
  CommenterUserType,
  useUser,
  ExtraFieldType,
  getPersonProfileLink,
  SaveAssessmentResultInput,
  StudentAssessmentExclusionInput,
} from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import { Chip } from '@mui/material';
import { useMemo } from 'react';
import set from 'lodash/set';
import { StudentTableAvatar } from '@tyro/people';
import { useAssessmentById } from '../../api/assessments';
import {
  useAssessmentResults,
  ReturnTypeFromUseAssessmentResults,
} from '../../api/assessment-results';
import {
  useCbaGradeSetsQuery,
  ReturnTypeFromUseCbaGradeSets,
} from '../../api/state-cba/grade-sets';
import { useUpdateStateCbaResult } from '../../api/state-cba/save-results';
import {
  ReturnTypeFromUseAssessmentById,
  ReturnTypeFromUseCommentBanksWithComments,
} from '../term-assessment/subject-group/edit-results';
import { useCommentBanksWithComments } from '../../api/comment-bank';
import { getExtraFields } from '../../utils/get-extra-fields';
import { updateStudentAssessmentExclusion } from '../../api/student-assessment-exclusion';

const getColumnDefs = (
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  displayName: ReturnTypeDisplayName,
  toast: ReturnOfUseToast['toast'],
  gradeSets: ReturnTypeFromUseCbaGradeSets[],
  assessmentData: ReturnTypeFromUseAssessmentById | null | undefined,
  commentBanks: ReturnTypeFromUseCommentBanksWithComments | undefined
): GridOptions<ReturnTypeFromUseAssessmentResults>['columnDefs'] => [
  {
    field: 'student',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentResults>) =>
      data?.student ? (
        <StudentTableAvatar
          person={data?.student?.person}
          isPriorityStudent={!!data?.student?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.student?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    pinned: 'left',
    lockVisible: true,
  },
  {
    field: 'examinable',
    headerName: t('assessments:examinable'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentResults, any>) => (
      <TableBooleanValue value={!!data?.examinable} />
    ),
    valueSetter: (
      params: ValueSetterParams<ReturnTypeFromUseAssessmentResults, boolean>
    ) => {
      const { newValue } = params;
      if (!newValue) {
        params?.node?.setDataValue('gradeId', null);
      }
      set(params.data ?? {}, 'examinable', params.newValue);
      return true;
    },
  },
  {
    field: 'studentClassGroup',
    headerName: t('common:class'),
  },
  {
    field: 'studentStudyLevel',
    headerName: t('common:level'),
    editable: true,
    valueSetter: (
      params: ValueSetterParams<ReturnTypeFromUseAssessmentResults>
    ) => {
      set(params.data ?? {}, 'studentStudyLevel', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentResults, any>) =>
      data?.studentStudyLevel ? (
        <TableStudyLevelChip level={data.studentStudyLevel} />
      ) : null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
  },
  {
    field: 'gradeId',
    headerName: t('assessments:achievement'),
    editable: (params) => !!params.data?.examinable,
    cellEditor: TableSwitch,
    valueGetter: ({ data }) => data?.gradeId,
    valueSetter: ({
      data,
      newValue,
    }: ValueSetterParams<ReturnTypeFromUseAssessmentResults, number>) => {
      set(data ?? {}, 'gradeId', newValue);
      return true;
    },
    valueFormatter: ({
      data,
    }: ValueFormatterParams<
      ReturnTypeFromUseAssessmentResults,
      ReturnTypeFromUseCbaGradeSets
    >) => {
      const selectedGradeSet = gradeSets?.find((x) => x.id === data?.gradeId);
      return selectedGradeSet?.name || '-';
    },
    cellEditorSelector: ({ data }) => {
      const options = gradeSets;
      if (data) {
        return {
          component: TableSelect<(typeof options)[number]>,
          popup: true,
          popupPosition: 'under',
          params: {
            options,
            optionIdKey: 'id',
            getOptionLabel: (option: (typeof options)[number]) => option?.name,
          },
        };
      }
    },
  },
  {
    colId: 'ppodSyncStatus',
    headerName: t('assessments:ppodStatus'),
    valueGetter: ({ data }) => {
      if (!data?.ppodPublished) return t('assessments:notSynced');
      const selectedGradeSet = gradeSets?.find((x) => x.id === data?.gradeId);
      if (selectedGradeSet?.name !== data.ppodResult) {
        return t('assessments:outOfSync');
      }
      return t('assessments:synced');
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentResults, any>) => {
      if (!data?.ppodPublished) {
        return (
          <Chip
            label={t('assessments:notSynced')}
            variant="soft"
            color="error"
          />
        );
      }

      const selectedGradeSet = gradeSets?.find((x) => x.id === data?.gradeId);
      if (selectedGradeSet?.name !== data.ppodResult) {
        return (
          <Chip
            label={t('assessments:outOfSync')}
            variant="soft"
            color="warning"
          />
        );
      }

      return (
        <Chip label={t('assessments:synced')} variant="soft" color="success" />
      );
    },
  },
  ...getExtraFields(assessmentData?.extraFields, commentBanks),
];

export default function EditStateCbaResults() {
  const { academicNamespaceId, subjectGroupId, assessmentId } = useParams();
  const { activeProfile } = useUser();
  const { toast } = useToast();
  const academicNamespaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const subjectGroupIdAsNumber = useNumber(subjectGroupId);
  const { t } = useTranslation(['assessments', 'common']);
  const { displayName } = usePreferredNameLayout();

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNamespaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });

  const { data: studentResults } = useAssessmentResults(
    academicNamespaceIdAsNumber ?? 0,
    {
      assessmentId: assessmentIdAsNumber ?? 0,
      subjectGroupIds: [subjectGroupIdAsNumber ?? 0],
    }
  );

  const gradeSetId =
    assessmentData?.gradeSets && assessmentData?.gradeSets[0]?.gradeSetId;

  const { data: gradeSets = [] } = useCbaGradeSetsQuery({ id: gradeSetId });

  const commentBanksRequired = useMemo(() => {
    if (!assessmentData) return [];

    const collectedCommentBanks =
      assessmentData?.extraFields?.reduce<number[]>((acc, extraField) => {
        if (
          extraField?.extraFieldType === ExtraFieldType.CommentBank &&
          extraField?.commentBankId
        ) {
          acc.push(extraField.commentBankId);
        }

        return acc;
      }, []) ?? [];

    if (assessmentData.commentBank?.commentBankId) {
      collectedCommentBanks.push(assessmentData.commentBank.commentBankId);
    }

    return collectedCommentBanks;
  }, [assessmentData]);

  const { data: commentBanks } = useCommentBanksWithComments({
    ids: commentBanksRequired,
  });

  const { mutateAsync: updateStateCbaResult } = useUpdateStateCbaResult(
    academicNamespaceIdAsNumber ?? 0,
    {
      assessmentId: assessmentIdAsNumber ?? 0,
      subjectGroupIds: [subjectGroupIdAsNumber ?? 0],
    }
  );

  const columnDefs = useMemo(
    () =>
      getColumnDefs(
        t,
        displayName,
        toast,
        gradeSets,
        assessmentData,
        commentBanks
      ),
    [t, displayName, toast, gradeSets, assessmentData, commentBanks]
  );

  const subjectGroup =
    Array.isArray(studentResults) && studentResults.length > 0
      ? studentResults[0]?.subjectGroup ?? null
      : null;

  const subjectGroupName = subjectGroup?.name ?? '';

  const handleBulkSave = async (
    data: BulkEditedRows<
      ReturnTypeFromUseAssessmentResults,
      'examinable' | 'gradeId' | 'studentStudyLevel' | 'extraFields'
    >
  ) => {
    const examinableChanges = Object.entries(data).reduce<
      StudentAssessmentExclusionInput[]
    >((acc, [key, value]) => {
      if (value.examinable) {
        acc.push({
          assessmentId: assessmentIdAsNumber ?? 0,
          studentPartyId: Number(key),
          subjectGroupId: subjectGroupIdAsNumber ?? 0,
          excluded: !value.examinable?.newValue,
        });
      }
      return acc;
    }, []);

    if (examinableChanges.length > 0) {
      await updateStudentAssessmentExclusion(
        academicNamespaceIdAsNumber ?? 0,
        examinableChanges
      );
    }

    const formattedData = studentResults?.reduce<SaveAssessmentResultInput[]>(
      (acc, result) => {
        const editedColumns = data[result.studentPartyId];
        if (editedColumns) {
          const newResult = {
            ...result,
            subjectGroupId: subjectGroupIdAsNumber ?? 0,
            assessmentId: assessmentData?.id ?? 0,
            gradeSetGradeId: result.gradeId,
          };

          Object.entries(editedColumns).forEach(([key, { newValue }]) => {
            if (key.startsWith('extraFields')) {
              const splitKey = key.split('.');
              const extraFieldId = Number(splitKey[1]);
              const extraFieldProperty = splitKey[2] as
                | 'commentBankCommentId'
                | 'result';

              if (newResult.extraFields?.[extraFieldId]) {
                set(
                  newResult.extraFields[extraFieldId],
                  extraFieldProperty,
                  newValue ?? null
                );
              } else {
                set(newResult.extraFields, extraFieldId, {
                  assessmentExtraFieldId: extraFieldId,
                  ...(extraFieldProperty === 'commentBankCommentId'
                    ? {
                        commentBankCommentId: newValue ?? null,
                      }
                    : { result: newValue ?? null }),
                });
              }
            } else {
              set(newResult, key, newValue ?? null);
            }
          });
          if (
            newResult.teacherComment?.comment ||
            newResult.teacherComment?.commentBankCommentId
          ) {
            newResult.teacherComment = {
              ...newResult.teacherComment,
              assessmentId: assessmentData?.id ?? 0,
              studentPartyId: result.studentPartyId,
              commenterUserType: CommenterUserType.Teacher,
              subjectGroupPartyId: subjectGroup?.partyId ?? 0,
              commenterPartyId: activeProfile?.partyId ?? 0,
            };
          }

          const { gradeId, ...resultWithoutGradeId } = newResult;
          acc.push({
            ...resultWithoutGradeId,
            extraFields: Object.values(newResult.extraFields).map(
              (value) => value
            ),
          });
        }

        return acc;
      },
      []
    );
    return updateStateCbaResult(formattedData as SaveAssessmentResultInput[]);
  };

  return (
    <PageContainer
      title={t('assessments:pageHeading.editResultsFor', {
        name: 'subjectGroupName',
      })}
    >
      <PageHeading
        title={t('assessments:pageHeading.editResultsFor', {
          name: subjectGroupName,
        })}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: '/assessments',
            },
            {
              name: t('assessments:pageHeading.termAssessmentSubjectGroups', {
                name: assessmentData?.name,
              }),
              href: './../..',
            },
            {
              name: t('assessments:actions.editResults'),
            },
          ],
        }}
      />
      <Table
        rowData={studentResults ?? []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.studentPartyId)}
        onBulkSave={handleBulkSave}
      />
    </PageContainer>
  );
}
