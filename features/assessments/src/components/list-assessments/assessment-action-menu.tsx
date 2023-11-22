import { useTranslation } from '@tyro/i18n';
import { ActionMenu, useDisclosure, useToast } from '@tyro/core';
import {
  EyeIcon,
  CommentIcon,
  EditIcon,
  StopIcon,
  CheckmarkCircleIcon,
  VerticalDotsIcon,
  EditCalendarIcon,
} from '@tyro/icons';
import { AssessmentType, useAcademicNamespace } from '@tyro/api';
import { getAssessmentSubjectGroupsLink } from '../../utils/get-assessment-subject-groups-link';
import { PublishAssessmentModal } from './publish-assessment-modal';
import {
  ReturnTypeFromUseAssessments,
  usePublishAssessment,
} from '../../api/assessments';

type AssessmentActionMenuProps = {
  id: ReturnTypeFromUseAssessments['id'];
  publishedFrom?: ReturnTypeFromUseAssessments['publishedFrom'];
  assessmentType: ReturnTypeFromUseAssessments['assessmentType'];
  academicNamespaceId: number;
  canEnterOverallComments: boolean;
};

export const AssessmentActionMenu = ({
  id,
  publishedFrom,
  assessmentType,
  academicNamespaceId,
  canEnterOverallComments,
}: AssessmentActionMenuProps) => {
  const { t } = useTranslation(['assessments']);
  const { toast } = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { activeAcademicNamespace } = useAcademicNamespace();
  const disableEdit =
    academicNamespaceId !== activeAcademicNamespace?.academicNamespaceId;

  const assessmentPath = getAssessmentSubjectGroupsLink(
    id,
    assessmentType,
    academicNamespaceId
  );

  const { mutateAsync: publishAssessment } = usePublishAssessment();

  const unpublishAssessment = () => {
    publishAssessment(
      {
        assessmentId: id,
        publish: false,
      },
      {
        onSuccess: () => {
          toast(t('assessments:unpublishedSuccessfully'));
        },
      }
    );
  };

  const isTermAssessment = assessmentType === AssessmentType.Term;

  return (
    <>
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
                    disabled: disableEdit,
                    disabledTooltip: disableEdit
                      ? t('assessments:editAssessmentsToolTip')
                      : undefined,
                    navigateTo: `${assessmentPath}/edit`,
                  },
                  ...(canEnterOverallComments
                    ? [
                        {
                          label: t('assessments:actions.makeOverallComments'),
                          icon: <CommentIcon />,
                          hasAccess: () =>
                            assessmentType === AssessmentType.Term,
                          navigateTo: `${assessmentPath}/overall-comments`,
                        },
                      ]
                    : []),
                ],

                publishedFrom
                  ? [
                      {
                        label: t('assessments:actions.editPublishDate'),
                        icon: <EditCalendarIcon />,
                        disabled: !isTermAssessment,
                        onClick: onOpen,
                      },
                      {
                        label: t('assessments:actions.unpublish'),
                        icon: <StopIcon />,
                        disabled: !isTermAssessment,
                        onClick: unpublishAssessment,
                      },
                    ]
                  : [
                      {
                        label: t('assessments:actions.publish'),
                        icon: <CheckmarkCircleIcon />,
                        disabled: !isTermAssessment,
                        onClick: onOpen,
                      },
                    ],
              ]
            : []
        }
      />
      <PublishAssessmentModal
        assessmentId={id}
        publishedFrom={publishedFrom}
        open={isOpen}
        onClose={onClose}
      />
    </>
  );
};
