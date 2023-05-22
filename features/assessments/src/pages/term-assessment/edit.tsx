import { useTranslation } from '@tyro/i18n';
import { PageHeading, useToast, useNumber, PageContainer } from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { CommentType } from '@tyro/api';
import { useAssessmentById } from '../../api/assessments';
import {
  TermAssessmentForm,
  FormValues,
} from '../../components/term-assessment/form';

export default function EditTermAssessmentPage() {
  const { toast } = useToast();

  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);

  const { t } = useTranslation(['assessments', 'common']);

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });

  const formValues = useMemo<FormValues | null>(() => {
    if (!assessmentData) return null;

    const {
      years,
      startDate,
      endDate,
      commentType,
      commentBank,
      extraFields,
      ...restData
    } = assessmentData;

    return {
      ...restData,
      years: years ?? [],
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
      includeTeacherComments: commentType !== CommentType.None,
      commentType: commentType === CommentType.None ? undefined : commentType,
      ...(commentBank && {
        commentBank: {
          id: commentBank.commentBankId,
          name: commentBank.commentBankName ?? '',
        },
      }),
      extraFields: (extraFields ?? []).flatMap((field) =>
        field?.extraFieldType && field.name
          ? [
              {
                ...field,
                ...(field.commentBankId && {
                  commentBank: {
                    id: field.commentBankId,
                    name: field.commentBankName ?? '',
                  },
                }),
              },
            ]
          : []
      ),
    };
  }, [assessmentData]);

  const titleName = t('assessments:pageHeading.editTermAssessment', {
    name: assessmentData?.name,
  });

  return (
    <PageContainer title={t('assessments:pageTitle.editTermAssessment')}>
      <PageHeading
        title={titleName}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: '/assessments',
            },
            {
              name: titleName,
            },
          ],
        }}
      />

      {formValues && (
        <TermAssessmentForm
          termAssessment={formValues}
          title={titleName}
          ctaText={t('assessments:editTermAssessment')}
          onSuccess={() => {
            toast(t('common:snackbarMessages.updateSuccess'));
          }}
          onError={console.error}
        />
      )}
    </PageContainer>
  );
}
