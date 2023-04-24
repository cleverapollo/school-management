import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { Assessment } from '@tyro/api';
import {
  EyeIcon,
  EditIcon,
  StopIcon,
  CheckmarkCircleIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { useNavigate } from 'react-router-dom';
import { getAssessmentSubjectGroupsLink } from '../../utils/get-assessment-subject-groups-link';

type AssessmentActionMenuProps = {
  id: Assessment['id'];
  publish: Assessment['publish'];
  assessmentType: Assessment['assessmentType'];
  academicNamespaceId: number;
};

export const AssessmentActionMenu = ({
  id,
  publish,
  assessmentType,
  academicNamespaceId,
}: AssessmentActionMenuProps) => {
  const { t } = useTranslation(['assessments', 'common']);
  const navigate = useNavigate();

  const assessmentPath = getAssessmentSubjectGroupsLink(
    id,
    assessmentType,
    academicNamespaceId
  );

  return (
    <ActionMenu
      iconOnly
      buttonIcon={<VerticalDotsIcon />}
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
              publish
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
