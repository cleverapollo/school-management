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
  const { t } = useTranslation(['assessment']);

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
          label: t('assessment:actions.view'),
          icon: <EyeIcon />,
          onClick: () => console.log('view', id),
        },
        {
          label: t('assessment:actions.edit'),
          icon: <EditIcon />,
          onClick: () => console.log('edit', id),
        },
        published
          ? {
              label: t('assessment:actions.unpublish'),
              icon: <StopIcon />,
              onClick: () => console.log('unpublish', id),
            }
          : {
              label: t('assessment:actions.publish'),
              icon: <CheckmarkCircleIcon />,
              onClick: () => console.log('publish', id),
            },
      ]}
    />
  );
};
