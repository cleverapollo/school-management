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
  ValueGetterParams,
  ValueFormatterParams,
  useToast,
  ReturnOfUseToast,
  TableSwitch,
  TableBooleanValue,
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
  StudentAssessmentExclusionInput,
} from '@tyro/api';
import set from 'lodash/set';
import { StudentTableAvatar } from '@tyro/people';
import { useAssessmentById } from '../../../api/assessments';
import {
  ReturnTypeFromUseAssessmentResults,
  useAssessmentResults,
  useUpdateAssessmentResult,
} from '../../../api/assessment-results';
import { useCommentBanksWithComments } from '../../../api/comment-bank';
import { checkAndSetGrades } from '../../../utils/check-and-set-grades';
import { CommentTypeCellEditor } from '../../../components/common/comment-type-cell-editor';
import { getExtraFields } from '../../../utils/get-extra-fields';
import { updateStudentAssessmentExclusion } from '../../../api/student-assessment-exclusion';

export type ReturnTypeFromUseAssessmentById = UseQueryReturnType<
  typeof useAssessmentById
>;

export type ReturnTypeFromUseCommentBanksWithComments = UseQueryReturnType<
  typeof useCommentBanksWithComments
>;

type ColumnDefs = NonNullable<
  GridOptions<ReturnTypeFromUseAssessmentResults>['columnDefs']
>;

function getCommentFields(
  assessmentData: ReturnTypeFromUseAssessmentById | null | undefined,
  commentBanks: ReturnTypeFromUseCommentBanksWithComments | undefined,
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  toast: ReturnOfUseToast['toast']
): ColumnDefs {
  if (assessmentData?.commentType === CommentType.None) {
    return [];
  }

  const matchedCommentBank =
    commentBanks?.find(
      (commentBank) =>
        commentBank.id === assessmentData?.commentBank?.commentBankId
    )?.comments || [];

  const getIsCommentBankSelector = (
    data: ReturnTypeFromUseAssessmentResults | undefined
  ) =>
    assessmentData?.commentType === CommentType.CommentBank ||
    !!data?.teacherComment?.commentBankCommentId ||
    data?.teacherComment?.commentBankCommentId === -1;

  const commentBankOptions = matchedCommentBank?.filter(
    (comment) => comment?.active
  );

  return [
    ...(assessmentData?.commentType === CommentType.Both
      ? [
          {
            colId: 'commentType',
            headerName: t('assessments:labels.commentType'),
            editable: true,
            cellEditorSelector: CommentTypeCellEditor(t),
            valueGetter: ({
              data,
            }: ValueGetterParams<ReturnTypeFromUseAssessmentResults>) =>
              data?.teacherComment?.commentBankCommentId
                ? CommentType.CommentBank
                : CommentType.FreeForm,
            valueSetter: ({
              data,
              newValue,
            }: ValueSetterParams<ReturnTypeFromUseAssessmentResults>) => {
              if (newValue === CommentType.CommentBank) {
                if (!commentBankOptions?.length) {
                  toast(t('assessments:noActiveCommentsInCommentBank'), {
                    variant: 'error',
                  });
                  return false;
                }

                set(data ?? {}, 'teacherComment.commentBankCommentId', -1);
              } else {
                set(data ?? {}, 'teacherComment.commentBankCommentId', null);
              }
              return true;
            },
            valueFormatter: ({
              value,
            }: ValueFormatterParams<
              ReturnTypeFromUseAssessmentResults,
              CommentType.CommentBank | CommentType.FreeForm
            >) => (value ? t(`assessments:labels.commentTypes.${value}`) : ''),
          },
        ]
      : []),
    {
      field: 'teacherComment',
      headerName: t('common:comment'),
      editable: true,
      autoHeight: true,
      wrapText: true,
      width: 350,
      cellStyle: {
        lineHeight: 2,
        paddingTop: 12,
        paddingBottom: 12,
        wordBreak: 'break-word',
      },
      cellEditorSelector: ({ data }) => {
        const isCommentBankSelector = getIsCommentBankSelector(data);

        return isCommentBankSelector
          ? {
              component: TableSelect,
              popup: true,
              popupPosition: 'under',
              params: {
                options: commentBankOptions,
                optionIdKey: 'id',
                getOptionLabel: (option: Comment) => option.comment,
              },
            }
          : {
              component: 'agLargeTextCellEditor',
              popup: true,
              params: {
                maxLength: assessmentData?.commentLength ?? 2000,
                rows: 10,
              },
            };
      },
      valueGetter: ({ data }) => {
        const isCommentBankSelector = getIsCommentBankSelector(data);

        return isCommentBankSelector
          ? data?.teacherComment?.commentBankCommentId
          : data?.teacherComment?.comment;
      },
      valueSetter: ({
        data,
        newValue,
      }: ValueSetterParams<
        ReturnTypeFromUseAssessmentResults,
        string | number | ReturnTypeFromUseAssessmentResults['teacherComment']
      >) => {
        const isCommentBankSelector = getIsCommentBankSelector(data);

        if (typeof newValue === 'object') {
          if (newValue?.commentBankCommentId === -1) {
            set(data ?? {}, 'teacherComment.commentBankCommentId', null);
            set(
              data ?? {},
              'teacherComment.comment',
              newValue?.comment ?? null
            );
            return true;
          }

          const newValueWithDefault = newValue ?? {};
          if (
            'comment' in newValueWithDefault ??
            ({} || 'commentBankCommentId' in newValueWithDefault)
          ) {
            set(data ?? {}, 'teacherComment', newValueWithDefault ?? null);
            return true;
          }
        }

        if (!newValue) {
          set(data ?? {}, 'teacherComment.comment', null);
          set(data ?? {}, 'teacherComment.commentBankCommentId', null);
        } else {
          const valuePath = isCommentBankSelector
            ? `teacherComment.commentBankCommentId`
            : `teacherComment.comment`;
          set(data ?? {}, valuePath, newValue);
        }
        return true;
      },
      valueFormatter: ({ data, value }) => {
        const isCommentBankSelector = getIsCommentBankSelector(data);

        if (isCommentBankSelector) {
          const matchedComment = matchedCommentBank?.find(
            (comment) => comment.id === value
          );

          return matchedComment?.comment ?? (value as string);
        }

        return value as string;
      },
    },
  ];
}

const getColumnDefs = (
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  displayName: ReturnTypeDisplayName,
  toast: ReturnOfUseToast['toast'],
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
        params?.node?.setDataValue('result', null);
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
    editable: ({ data }) => !!data?.examinable,
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
  ...getCommentFields(assessmentData, commentBanks, t, toast),
  ...getExtraFields(assessmentData?.extraFields, commentBanks),
];

export default function EditTermAssessmentResults() {
  const { academicNamespaceId, subjectGroupId, assessmentId } = useParams();
  const { activeProfile } = useUser();
  const { toast } = useToast();
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
        toast,
        assessmentData,
        commentBanks,
        academicNamespaceIdAsNumber ?? 0
      ),
    [
      t,
      displayName,
      toast,
      assessmentData,
      commentBanks,
      academicNamespaceIdAsNumber,
    ]
  );

  const saveAssessmentResult = async (
    data: BulkEditedRows<
      ReturnTypeFromUseAssessmentResults,
      | 'examinable'
      | 'extraFields'
      | 'result'
      | 'gradeResult'
      | 'targetResult'
      | 'targetGradeResult'
      | 'teacherComment.comment'
      | 'subjectGroup.irePP.examinable'
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
        onCellValueChanged={({ node, data, colDef }) => {
          if (colDef.colId === 'commentType') {
            if (data?.teacherComment?.commentBankCommentId === -1) {
              const matchedCommentBank =
                commentBanks?.find(
                  (commentBank) =>
                    commentBank.id ===
                    assessmentData?.commentBank?.commentBankId
                )?.comments || [];

              const firstActiveComment = matchedCommentBank?.find(
                (comment) => comment?.active
              );
              node?.setDataValue(
                'teacherComment',
                firstActiveComment?.id ?? null
              );
            } else {
              node?.setDataValue('teacherComment', null);
            }
          }
        }}
      />
    </PageContainer>
  );
}
