import { useTranslation } from '@tyro/i18n';
import { ActionMenu, ActionMenuProps } from '@tyro/core';
import { Assessment, AssessmentType } from '@tyro/api';
import {
  EyeIcon,
  EditIcon,
  StopIcon,
  CheckmarkCircleIcon,
  VerticalDotsIcon,
  CommentIcon,
} from '@tyro/icons';
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
  const { t } = useTranslation(['assessments']);

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
        assessmentPath
          ? [
              [
                {
                  label: t('assessments:actions.view'),
                  icon: <EyeIcon />,
                  navigateTo: assessmentPath,
                },
                {
                  label: t('assessments:actions.edit'),
                  icon: <EditIcon />,
                  navigateTo: `${assessmentPath}/edit`,
                },
                // {
                //   label: t('assessments:actions.makeOverallComments'),
                //   icon: <CommentIcon />,
                //   hasAccess: () => assessmentType === AssessmentType.Term,
                //   navigateTo: `${assessmentPath}/overall-comments`,
                // },
              ],
              [
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
              ],
            ]
          : []
      }
    />
  );
};
