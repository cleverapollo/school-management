import { useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { PageHeading, useToast, useNumber, PageContainer } from '@tyro/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Colour, StateCbaType } from '@tyro/api';
import { useAssessmentById } from '../../api/assessments';
import { StateCbaForm } from '../../components/state-cba/form';

const defaultYear = { name: '-', yearGroupId: 0 };
const defaultSubject = {
  colour: Colour.Purple,
  id: 0,
  name: '-',
};

export default function EditStateCba() {
  const { toast } = useToast();

  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);

  const { t } = useTranslation(['assessments', 'common']);

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });

  const formValues = useMemo(() => {
    if (!assessmentData) return null;

    const {
      stateCbaType,
      years,
      startDate,
      endDate,
      commentBank,
      extraFields,
      subjectGroups,
      ...restData
    } = assessmentData;

    const commentBankValues = {
      commentBank,
    } as const;
    const commentBanks = Object.entries(commentBankValues) as [
      keyof typeof commentBankValues,
      (typeof commentBankValues)[keyof typeof commentBankValues]
    ][];

    const formattedSubject = subjectGroups?.[0]?.subjects?.[0];
    const formattedYear = years?.[0];

    return {
      ...restData,
      cbaType: stateCbaType || StateCbaType.Cba_1,
      years: formattedYear || defaultYear,
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
      subject: formattedSubject || defaultSubject,
      groups: subjectGroups,
      ...commentBanks.reduce((acc, [key, bankValue]) => {
        if (bankValue) {
          acc[key] = {
            id: bankValue.commentBankId,
            name: bankValue.commentBankName ?? '',
          };
        }

        return acc;
      }, {} as Record<keyof typeof commentBankValues, { id: number; name: string }>),
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
    } as const;
  }, [assessmentData]);

  const titleName = t('assessments:pageHeading.editStateCba', {
    name: assessmentData?.name,
  });

  return (
    <PageContainer title={t('assessments:pageTitle.editStateCba')}>
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
        <StateCbaForm
          stateCba={formValues}
          title={titleName}
          onSuccess={() => {
            toast(t('common:snackbarMessages.updateSuccess'));
          }}
          onError={() => {
            toast(t('common:snackbarMessages.errorFailed'), {
              variant: 'error',
            });
          }}
        />
      )}
    </PageContainer>
  );
}
