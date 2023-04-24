import { useTranslation } from '@tyro/i18n';
import { PageHeading, useToast, useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { CommentType } from '@tyro/api';
import { PageContainer } from '../../components/page-container';
import { useAssessments } from '../../api/assessments';
import {
  TermAssessmentForm,
  FormValues,
} from '../../components/term-assessment/form';

export default function EditTermAssessmentPage() {
  const { toast } = useToast();

  const { assessmentId: paramId } = useParams();
  const assessmentId = useNumber(paramId);

  const { t } = useTranslation(['assessments', 'common']);

  const { data: [termAssessmentData] = [] } = useAssessments({
    ...(assessmentId && { ids: [assessmentId] }),
  });

  const formValues = useMemo<FormValues | null>(() => {
    if (!termAssessmentData) return null;

    const {
      id,
      name,
      years,
      startDate,
      endDate,
      captureTarget,
      commentType,
      commentBank,
      commentLength,
      captureTutorComment,
      captureYearHeadComment,
      captureHouseMasterComment,
      capturePrincipalComment,
      extraFields,
    } = termAssessmentData;

    return {
      id,
      name,
      years: years ?? [],
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
      captureTarget,
      includeTeacherComments: commentType !== CommentType.None,
      commentType: commentType === CommentType.None ? undefined : commentType,
      ...(commentBank && {
        commentBank: {
          id: commentBank.commentBankId,
        },
      }),
      commentLength,
      captureTutorComment,
      captureYearHeadComment,
      captureHouseMasterComment,
      capturePrincipalComment,
      extraFields: (extraFields ?? []).flatMap((field) =>
        field?.extraFieldType && field.name
          ? [
              {
                name: field.name,
                extraFieldType: field.extraFieldType,
                commentLength: field.commentLength,
                ...(field.commentBankId && {
                  commentBank: {
                    id: field.commentBankId,
                  },
                }),
              },
            ]
          : []
      ),
    };
  }, [termAssessmentData]);

  const titleName = t('assessments:pageHeading.editTermAssessment', {
    name: termAssessmentData?.name,
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
