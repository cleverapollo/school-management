import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useDeleteContacts } from '../../api/contact/delete-contacts';
import { ReturnTypeFromUseContacts } from '../../api/contact/list';

interface DeleteContactsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedContacts: ReturnTypeFromUseContacts[];
}

export function DeleteContactsDialog({
  open,
  onClose,
  selectedContacts,
}: DeleteContactsDialogProps) {
  const { t } = useTranslation(['common', 'people']);

  const { mutateAsync: deleteContacts } = useDeleteContacts();

  const onSubmit = async () => {
    await deleteContacts({
      contactPartyIds: selectedContacts.map((contact) => contact.partyId),
    });
  };

  return (
    <ConfirmDialog
      isDelete
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('people:deleteContacts', { count: selectedContacts.length })}
      description={t('people:areYouSureYouWantToDeleteContacts')}
      confirmText={t('common:delete')}
    />
  );
}
