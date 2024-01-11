import { useTranslation } from '@tyro/i18n';
import { ConfirmDialog } from '@tyro/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { usePublishFee } from '../../api/publish-fee';
import { ReturnTypeFromUseFees } from '../../api/fees';

dayjs.extend(LocalizedFormat);

type PublishFeeConfirmModalProps = {
  open: boolean;
  feeToPublish: ReturnTypeFromUseFees | null;
  onClose: () => void;
};

export function PublishFeeConfirmModal({
  open,
  feeToPublish,
  onClose,
}: PublishFeeConfirmModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  const { mutate: publishFee } = usePublishFee();

  const isCurrentPublished = feeToPublish?.published;

  const onSubmit = () => {
    publishFee(
      { feeId: feeToPublish?.id ?? 0, publish: !isCurrentPublished },
      { onSuccess: onClose }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={
        isCurrentPublished ? t('fees:unpublishOnline') : t('fees:publishOnline')
      }
      description={
        isCurrentPublished
          ? t('fees:unpublishOnlineDescription', {
              feeName: feeToPublish?.name ?? '',
            })
          : t('fees:publishOnlineDescription', {
              feeName: feeToPublish?.name ?? '',
            })
      }
      confirmText={t('common:actions.confirm')}
    />
  );
}
