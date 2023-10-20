import { Stack } from '@mui/material';
import { PageContainer, PageHeading, Select, useNumber } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useYearGroupById } from '@tyro/groups';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReturnTypeFromUseAssessmentById,
  useAssessmentById,
} from '../../api/assessments';
import { StudentSelectorForOverallComments } from '../../components/overall-comments/student-selector';

export default function OverallCommentsTermAssessmentPage() {
  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const [selectedYearGroup, setSelectedYearGroup] =
    useState<NonNullable<ReturnTypeFromUseAssessmentById['years']>[number]>();

  const { t } = useTranslation(['assessments', 'common']);

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: studentListForYearGroup } = useYearGroupById(
    {
      yearGroupIds: [selectedYearGroup?.yearGroupId ?? 0],
    },
    !!selectedYearGroup?.yearGroupId
  );

  const titleName = t('assessments:pageHeading.overallCommentsFor', {
    name: assessmentData?.name,
  });

  useEffect(() => {
    if (!selectedYearGroup && assessmentData?.years?.length) {
      setSelectedYearGroup(assessmentData.years[0]);
    }
  }, [assessmentData?.years]);

  console.log({
    assessmentData,
    selectedYearGroup,
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

      <Stack direction="row">
        <Select
          label={t('common:year')}
          variant="white-filled"
          value={selectedYearGroup?.yearGroupId ?? ''}
          onChange={(event) => {
            const yearGroupId = Number(event.target.value);
            const yearGroup = assessmentData?.years?.find(
              (year) => year.yearGroupId === yearGroupId
            );
            setSelectedYearGroup(yearGroup);
          }}
          optionIdKey="yearGroupId"
          optionTextKey="name"
          options={assessmentData?.years ?? []}
          sx={{ maxWidth: 216, flex: 1 }}
        />
      </Stack>
      <Stack direction="row">
        <StudentSelectorForOverallComments
          yearGroup={selectedYearGroup}
          students={studentListForYearGroup?.students ?? []}
        />
      </Stack>
    </PageContainer>
  );
}
