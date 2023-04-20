import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { Assessment } from '@tyro/api';
import { EyeIcon, EditIcon, StopIcon, CheckmarkCircleIcon } from '@tyro/icons';
import { useNavigate } from 'react-router-dom';
import { getAssessmentSubjectGroupsLink } from '../../utils/get-assessment-subject-groups-link';

type AssessmentActionMenuProps = Partial<{
  id: Assessment['id'];
  published: Assessment['publish'];
  assessmentType: Assessment['assessmentType'];
}>;

export const AssessmentActionMenu = ({
  id,
  published,
  assessmentType,
}: AssessmentActionMenuProps) => {
  const { t } = useTranslation(['assessments']);
  const navigate = useNavigate();

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
                onClick: () =>
                  navigate(getAssessmentSubjectGroupsLink(id, assessmentType)),
              },
              {
                label: t('assessments:actions.edit'),
                icon: <EditIcon />,
                onClick: () => console.log('edit', id),
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
