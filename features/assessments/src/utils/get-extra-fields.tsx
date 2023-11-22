import { GridOptions, TableSelect } from '@tyro/core';
import { Comment, ExtraFieldType } from '@tyro/api';
import set from 'lodash/set';
import {
  ReturnTypeFromUseAssessmentById,
  ReturnTypeFromUseCommentBanksWithComments,
} from '../pages/term-assessment/subject-group/edit-results';
import { ReturnTypeFromUseAssessmentResults } from '../api/assessment-results';

type ColumnDefs = NonNullable<
  GridOptions<ReturnTypeFromUseAssessmentResults>['columnDefs']
>;

export function getExtraFields(
  extraFields: ReturnTypeFromUseAssessmentById['extraFields'],
  commentBanks: ReturnTypeFromUseCommentBanksWithComments | undefined
): ColumnDefs {
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
