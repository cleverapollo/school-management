import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { Assessment } from '@tyro/api';
import { EyeIcon, EditIcon, StopIcon, CheckmarkCircleIcon } from '@tyro/icons';
import { useNavigate } from 'react-router-dom';
import { getAssessmentSubjectGroupsLink } from '../../utils/get-assessment-subject-groups-link';

type AssessmentActionMenuProps = {
  id: Assessment['id'];
  published: Assessment['publish'];
  assessmentType: Assessment['assessmentType'];
  academicNameSpaceId: number;
};

export const AssessmentActionMenu = ({
  id,
  published,
  assessmentType,
  academicNameSpaceId,
}: AssessmentActionMenuProps) => {
  const { t } = useTranslation(['assessments']);
  const navigate = useNavigate();

  const assessmentPath = getAssessmentSubjectGroupsLink(
    id,
    assessmentType,
    academicNameSpaceId
  );

  return (
    <ActionMenu
      menuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      }}
      menuItems={
        id && assessmentType
          ? [
              {
                label: t('assessments:actions.view'),
                icon: <EyeIcon />,
                onClick: () => navigate(assessmentPath),
              },
              {
                label: t('assessments:actions.edit'),
                icon: <EditIcon />,
                onClick: () => navigate(`${assessmentPath}/edit`),
              },
              published
                ? {
                    label: t('assessments:actions.unpublish'),
                    icon: <StopIcon />,
                    onClick: () => console.log('unpublish', id),
                  }
                : {
                    label: t('assessments:actions.publish'),
                    icon: <CheckmarkCircleIcon />,
                    onClick: () => console.log('publish', id),
                  },
            ]
          : []
      }
    />
  );
};
