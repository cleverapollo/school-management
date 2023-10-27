import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseStudentsContacts } from 'features/people/src/api/student/overview';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateSiblingsAndContacts } from '../../../api/student/update-siblings-and-contacts';
import { RHFContactAutocomplete } from '../../common/contact-autocomplete';

export interface ManageContactsModalProps {
  open: boolean;
  onClose: () => void;
  studentPartyId: number;
  currentContacts: Pick<
    ReturnTypeFromUseStudentsContacts,
    'relationshipType' | 'person'
  >[];
}

interface ManageContactsFormValues {
  contacts: Pick<
    ReturnTypeFromUseStudentsContacts,
    'relationshipType' | 'person'
  >[];
}

export function ManageContactsModal({
  open,
  onClose,
  studentPartyId,
  currentContacts,
}: ManageContactsModalProps) {
  const { t } = useTranslation(['common', 'timetable', 'people']);
  const { mutateAsync: updateSiblingsAndContacts, isLoading } =
    useUpdateSiblingsAndContacts();

  const { reset, handleSubmit, setValue, control, watch } =
    useForm<ManageContactsFormValues>();

  const onSubmit = handleSubmit((data) => {
    const selectedSiblings = [
      ...data.enrolledSiblings,
      ...data.nonEnrolledSiblings,
    ].map(({ partyId }) => partyId);
    const originalSiblings = [
      ...currentSiblings.enrolledSiblings,
      ...currentSiblings.nonEnrolledSiblings,
    ].map(({ partyId }) => partyId);

    const linkSiblings = selectedSiblings.filter(
      (partyId) => !originalSiblings.includes(partyId)
    );
    const unlinkSiblings = originalSiblings.filter(
      (partyId) => !selectedSiblings.includes(partyId)
    );

    const linkContacts = Object.entries(data.newContacts).map(
      ([contactPartyId, relationshipType]) => ({
        contactPartyId: Number(contactPartyId),
        relationshipType,
      })
    );

    updateSiblingsAndContacts(
      {
        studentPartyId,
        linkSiblings,
        unlinkSiblings,
        linkContacts,
      },
      {
        onSuccess: () => {
          closeAndResetModal();
        },
      }
    );
  });

  useEffect(() => {
    if (open) {
      reset({
        contacts: currentContacts,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle onClose={onClose}>{t('people:manageContacts')}</DialogTitle>
      <DialogContent>
        <RHFContactAutocomplete<ManageContactsFormValues>
          renderAvatarTags={() => null}
          controlProps={{
            control,
            name: 'contacts',
          }}
        />

        <SiblingListContainer>
          {contacts.map((sibling) => (
            <SiblingListItem
              key={sibling.partyId}
              person={sibling.person}
              onRemove={removeEnrolledSibling}
            >
              <Typography
                component="h4"
                variant="subtitle2"
                color="text.primary"
              >
                {displayName(sibling.person)}
              </Typography>
              {sibling.classGroup?.name && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {sibling.classGroup?.name}
                </Typography>
              )}
            </SiblingListItem>
          ))}
        </SiblingListContainer>
      </DialogContent>

      <DialogActions>
        <Button variant="soft" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={onSubmit}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
