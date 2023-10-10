import {
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  TableSelect,
  TableStudyLevelChip,
  useNumber,
  usePreferredNameLayout,
  PageContainer,
  StudyLevelSelectCellEditor,
  ValueSetterParams,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  UseQueryReturnType,
  CommentType,
  Comment,
  ExtraFieldType,
  SaveAssessmentResultInput,
  CommenterUserType,
  useUser,
  getPersonProfileLink,
} from '@tyro/api';
import set from 'lodash/set';
import { StudentTableAvatar } from '@tyro/people';
import { useAssessmentById } from '../../../api/assessments';
import {
  ReturnTypeFromUseAssessmentResults,
  useAssessmentResults,
  useUpdateAssessmentResult,
} from '../../../api/term-assessments/results';
import { useCommentBanksWithComments } from '../../../api/comment-bank';
import { checkAndSetGrades } from '../../../utils/check-and-set-grades';

export type ReturnTypeFromUseAssessmentById = UseQueryReturnType<
  typeof useAssessmentById
>;

export type ReturnTypeFromUseCommentBanksWithComments = UseQueryReturnType<
  typeof useCommentBanksWithComments
>;

function getExtraFields(
  extraFields: ReturnTypeFromUseAssessmentById['extraFields'],
  commentBanks: ReturnTypeFromUseCommentBanksWithComments | undefined
): NonNullable<GridOptions<ReturnTypeFromUseAssessmentResults>['columnDefs']> {
  return (
    extraFields?.map((extraField) => {
      const matchedCommentBank = commentBanks?.find(
        (commentBank) => commentBank.id === extraField?.commentBankId
      );

      const commonFields = {
        headerName: extraField?.name ?? '',
        editable: true,
      };

      switch (extraField?.extraFieldType) {
        case ExtraFieldType.CommentBank:
          return {
            ...commonFields,
            field: `extraFields.${extraField.id}.commentBankCommentId`,
            valueFormatter: ({ value }) => {
              const matchedComment = matchedCommentBank?.comments?.find(
                (comment) => comment.id === value
              );

              return matchedComment?.comment ?? (value as string);
            },
            valueGetter: ({ data }) => {
              const extraFieldValues = data?.extraFields ?? {};
              const matchedExtraField = extraFieldValues[extraField.id];
              return matchedExtraField?.commentBankCommentId;
            },
            valueSetter: ({ data, newValue }) => {
              set(
                data ?? {},
                `extraFields.${extraField.id}.commentBankCommentId`,
                newValue
              );
              set(
                data ?? {},
                `extraFields.${extraField.id}.assessmentExtraFieldId`,
                extraField.id
              );
              return true;
            },
            cellEditorSelector: () => ({
              component: TableSelect,
              popup: true,
              popupPosition: 'under',
              params: {
                options:
                  matchedCommentBank?.comments?.filter(
                    (comment) => comment?.active
                  ) || [],
                optionIdKey: 'id',
                getOptionLabel: (option: Comment) => option.comment,
              },
            }),
          };
        default:
          return {
            ...commonFields,
            field: `extraFields.${extraField.id}.result`,
            valueGetter: ({ data }) => {
              const extraFieldValues = data?.extraFields ?? {};
              const matchedExtraField = extraFieldValues[extraField.id];
              return matchedExtraField?.result;
            },
            valueSetter: ({ data, newValue }) => {
              set(data ?? {}, `extraFields.${extraField.id}.result`, newValue);
              set(
                data ?? {},
                `extraFields.${extraField.id}.assessmentExtraFieldId`,
                extraField.id
              );
              return true;
            },
            cellEditorSelector: () => ({
              component: 'agLargeTextCellEditor',
              popup: true,
              params: {
                maxLength: extraField?.commentLength ?? 2000,
              },
            }),
          };
      }
    }) ?? []
  );
}

const getColumnDefs = (
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  displayName: ReturnTypeDisplayName,
  assessmentData: ReturnTypeFromUseAssessmentById | null | undefined,
  commentBanks: ReturnTypeFromUseCommentBanksWithComments | undefined,
  academicNamespaceId: number
): GridOptions<ReturnTypeFromUseAssessmentResults>['columnDefs'] => [
  {
    field: 'student',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentResults>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student?.person}
          isPriorityStudent={!!data?.student?.extensions}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.student?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    pinned: 'left',
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
      if (!params.isEditCheckCall) {
        checkAndSetGrades(academicNamespaceId, params);
      }
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
    field: 'result',
    headerName: t('common:result'),
    editable: true,
    valueFormatter: ({ value }) =>
      typeof value === 'number' ? `${value}%` : '',
    valueSetter: (
      params: ValueSetterParams<ReturnTypeFromUseAssessmentResults>
    ) => {
      const value = !params.newValue ? undefined : Number(params.newValue);
      set(
        params.data ?? {},
        'result',
        Number.isNaN(value) || value === undefined
          ? undefined
          : Math.max(0, Math.min(100, value))
      );

      if (!params.isEditCheckCall) {
        checkAndSetGrades(academicNamespaceId, params);
      }
      return true;
    },
  },
  {
    field: 'gradeResult',
    headerName: t('common:grade'),
  },
  {
    field: 'targetResult',
    headerName: t('assessments:targetResult'),
    editable: true,
    hide: !assessmentData?.captureTarget,
    suppressColumnsToolPanel: !assessmentData?.captureTarget,
    valueFormatter: ({ value }) =>
      typeof value === 'number' ? `${value}%` : '',
    valueSetter: (
      params: ValueSetterParams<ReturnTypeFromUseAssessmentResults>
    ) => {
      const value = !params.newValue ? undefined : Number(params.newValue);
      set(
        params.data ?? {},
        'targetResult',
        Number.isNaN(value) || value === undefined
          ? undefined
          : Math.max(0, Math.min(100, value))
      );

      if (!params.isEditCheckCall) {
        checkAndSetGrades(academicNamespaceId, params);
      }
      return true;
    },
  },
  {
    field: 'targetGradeResult',
    headerName: t('assessments:targetGrade'),
    hide: !assessmentData?.captureTarget,
    suppressColumnsToolPanel: !assessmentData?.captureTarget,
  },
  {
    field: 'teacherComment.comment',
    hide: assessmentData?.commentType === CommentType.None,
    suppressColumnsToolPanel: assessmentData?.commentType === CommentType.None,
    headerName: t('common:comment'),
    editable: true,
    cellEditorSelector: () => ({
      component: 'agLargeTextCellEditor',
      popup: true,
      params: {
        maxLength: assessmentData?.commentLength ?? 2000,
      },
    }),
    valueSetter: ({ data, newValue }) => {
      if (!newValue) {
        data.teacherComment = null;
      } else {
        set(data ?? {}, `teacherComment.comment`, newValue);
      }
      return true;
    },
  },
  ...getExtraFields(assessmentData?.extraFields, commentBanks),
];

export default function EditTermAssessmentResults() {
  const { academicNamespaceId, subjectGroupId, assessmentId } = useParams();
  const { activeProfile } = useUser();
  const academicNamespaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const subjectGroupIdAsNumber = useNumber(subjectGroupId);
  const { t } = useTranslation(['assessments', 'common']);
  const { displayName } = usePreferredNameLayout();
  const assessmentResultsFilter = {
    assessmentId: assessmentIdAsNumber ?? 0,
    subjectGroupIds: [subjectGroupIdAsNumber ?? 0],
  };

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNamespaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: studentResults } = useAssessmentResults(
    academicNamespaceIdAsNumber ?? 0,
    assessmentResultsFilter
  );

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

  const { mutateAsync: updateAssessmentResult } = useUpdateAssessmentResult(
    academicNamespaceIdAsNumber ?? 0,
    assessmentResultsFilter
  );

  const subjectGroup =
    Array.isArray(studentResults) && studentResults.length > 0
      ? studentResults[0]?.subjectGroup ?? null
      : null;

  const subjectGroupName = subjectGroup?.name ?? '';

  const columnDefs = useMemo(
    () =>
      getColumnDefs(
        t,
        displayName,
        assessmentData,
        commentBanks,
        academicNamespaceIdAsNumber ?? 0
      ),
    [t, displayName, assessmentData, commentBanks, academicNamespaceIdAsNumber]
  );

  const saveAssessmentResult = (
    data: BulkEditedRows<
      ReturnTypeFromUseAssessmentResults,
      | 'extraFields'
      | 'result'
      | 'gradeResult'
      | 'targetResult'
      | 'targetGradeResult'
      | 'teacherComment.comment'
    >
  ) => {
    const results = studentResults?.reduce<SaveAssessmentResultInput[]>(
      (acc, result) => {
        const editedColumns = data[result.studentPartyId];
        if (editedColumns) {
          const newResult = {
            ...result,
            subjectGroupId: subjectGroupIdAsNumber ?? 0,
            assessmentId: assessmentData?.id ?? 0,
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

          if (newResult.teacherComment?.comment) {
            newResult.teacherComment = {
              ...newResult.teacherComment,
              assessmentId: assessmentData?.id ?? 0,
              studentPartyId: result.studentPartyId,
              commenterUserType: CommenterUserType.Teacher,
              subjectGroupPartyId: subjectGroup?.partyId ?? 0,
              commenterPartyId: activeProfile?.partyId ?? 0,
            };
          }

          acc.push({
            ...newResult,
            extraFields: Object.values(newResult.extraFields).map(
              (value) => value
            ),
          });
        }
        return acc;
      },
      []
    );

    if (!results) return Promise.reject();

    return updateAssessmentResult(results);
  };

  return (
    <PageContainer
      title={t('assessments:pageHeading.editResultsFor', {
        name: subjectGroupName,
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
        onBulkSave={saveAssessmentResult}
      />
    </PageContainer>
  );
}
