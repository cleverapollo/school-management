import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { Assessment } from '@tyro/api';
import { EyeIcon, EditIcon, StopIcon, CheckmarkCircleIcon } from '@tyro/icons';

type AssessmentActionMenuProps = {
  id: Assessment['id'] | undefined;
  published: Assessment['publish'];
};

export const AssessmentActionMenu = ({
  id,
  published,
}: AssessmentActionMenuProps) => {
  const { t } = useTranslation(['assessments']);

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
      menuItems={[
        {
          label: t('assessments:actions.view'),
          icon: <EyeIcon />,
          onClick: () => console.log('view', id),
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
      ]}
    />
  );
};
