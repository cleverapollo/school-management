import { useTranslation } from '@tyro/i18n';
import { ActionMenu, useDisclosure, useNumber, useToast } from '@tyro/core';
import {
  EyeIcon,
  CommentIcon,
  EditIcon,
  StopIcon,
  CheckmarkCircleIcon,
  VerticalDotsIcon,
  EditCalendarIcon,
} from '@tyro/icons';
import {
  AssessmentType,
  useAcademicNamespace,
  usePermissions,
} from '@tyro/api';
import { getAssessmentSubjectGroupsLink } from '../../utils/get-assessment-subject-groups-link';
import { PublishAssessmentModal } from './publish-assessment-modal';
import {
  ReturnTypeFromUseAssessments,
  usePublishAssessment,
} from '../../api/assessments';
import { usePublishStateCbaOnline } from '../../api/state-cba/publish-state-cba-to-parents';
import { getAssessmentSubjectGroups } from '../../api/assessment-subject-groups';

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
  const academicNamespaceIdAsNumber =
    useNumber(activeAcademicNamespace?.academicNamespaceId) ?? 0;
  const { hasPermission } = usePermissions();
  const disableEdit =
    academicNamespaceId !== activeAcademicNamespace?.academicNamespaceId;

  const assessmentPath = getAssessmentSubjectGroupsLink(
    id,
    assessmentType,
    academicNamespaceId
  );

  const { mutateAsync: publishAssessment } = usePublishAssessment();
  const { mutateAsync: publishStateCba } = usePublishStateCbaOnline();

  const isTermAssessment = assessmentType === AssessmentType.Term;

  const unpublishAssessment = async () => {
    if (isTermAssessment) {
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
    } else {
      try {
        const response = await getAssessmentSubjectGroups(
          academicNamespaceIdAsNumber,
          {
            assessmentId: id,
          }
        );

        const data = response?.assessment_assessmentSubjectGroups;
        const subjectGroupIds = data?.map(
          (subject) => subject?.subjectGroup?.partyId
        );

        publishStateCba(
          {
            assessmentId: id,
            subjectGroupIds,
            publish: false,
          },
          {
            onSuccess: () => {
              toast(t('assessments:unpublishedSuccessfully'));
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

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
                  {
                    label: t('assessments:actions.makeOverallComments'),
                    icon: <CommentIcon />,
                    hasAccess: () =>
                      isTermAssessment && canEnterOverallComments,
                    navigateTo: `${assessmentPath}/overall-comments`,
                  },
                ],

                publishedFrom
                  ? [
                      {
                        label: t('assessments:actions.editPublishDate'),
                        icon: <EditCalendarIcon />,
                        onClick: onOpen,
                      },
                      {
                        label: t('assessments:actions.unpublish'),
                        icon: <StopIcon />,
                        onClick: unpublishAssessment,
                        hasAccess: () =>
                          isTermAssessment
                            ? hasPermission('ps:1:term_publish_to_parents')
                            : hasPermission(
                                'ps:1:assessment:cba_publish_to_parents'
                              ),
                      },
                    ]
                  : [
                      {
                        label: t('assessments:actions.publish'),
                        icon: <CheckmarkCircleIcon />,
                        onClick: onOpen,
                        hasAccess: () =>
                          isTermAssessment
                            ? hasPermission('ps:1:term_publish_to_parents')
                            : hasPermission(
                                'ps:1:assessment:cba_publish_to_parents'
                              ),
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
        isTermAssessment={isTermAssessment}
        academicNamespaceIdAsNumber={academicNamespaceIdAsNumber}
      />
    </>
  );
};
