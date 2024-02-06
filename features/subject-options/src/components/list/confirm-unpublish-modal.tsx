import { useTranslation } from '@tyro/i18n';
import { ConfirmDialog } from '@tyro/core';
import { ReturnTypeFromUseOptionsSetupList } from '../../api/options';
import { usePublishOptions } from '../../api/publish-options';

interface ConfirmUnpublishModalProps {
  optionsToUnpublish: ReturnTypeFromUseOptionsSetupList | null;
  open: boolean;
  onClose: () => void;
}

export function ConfirmUnpublishModal({
  optionsToUnpublish,
  open,
  onClose,
}: ConfirmUnpublishModalProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const { mutateAsync } = usePublishOptions();

  const onConfirmUnpublish = () => {
    if (optionsToUnpublish?.id) {
      return mutateAsync(
        {
          publish: false,
          optionId: optionsToUnpublish.id,
        },
        {
          onSuccess: onClose,
        }
      );
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title={t('subjectOptions:unpublishOptions')}
      description={t('subjectOptions:areYouSureYouWantToUnpublish', {
        optionsName: optionsToUnpublish?.name ?? '',
      })}
      confirmText={t('common:actions.unpublish')}
      onClose={onClose}
      onConfirm={onConfirmUnpublish}
    />
  );
}
