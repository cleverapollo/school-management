import { PageContainer, PageHeading, useNumber } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import { useAssessmentById } from '../../api/assessments';

export default function OverallCommentsTermAssessmentPage() {
  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);

  const { t } = useTranslation(['assessments', 'common']);

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });

  const titleName = t('assessments:pageHeading.overallCommentsFor', {
    name: assessmentData?.name,
  });

  return (
    <PageContainer title={titleName}>
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
    </PageContainer>
  );
}
