import { LoadingButton } from '@mui/lab';
import { Button, Typography, Stack, Tooltip, IconButton } from '@mui/material';
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  usePreferredNameLayout,
} from '@tyro/core';
import { StudentContactType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CloseIcon } from '@tyro/icons';
import { ReturnTypeFromUseStudentsContacts } from '../../../api/student/overview';
import { useUpdateSiblingsAndContacts } from '../../../api/student/update-siblings-and-contacts';
import {
  ContactAutocomplete,
  ContactSelectOption,
} from '../../common/contact-autocomplete';

export interface ManageContactsModalProps {
  open: boolean;
  onClose: () => void;
  studentPartyId: number;
  currentContacts: Pick<
    ReturnTypeFromUseStudentsContacts,
    'partyId' | 'relationshipType' | 'person'
  >[];
}

interface ManageContactsFormValues {
  contacts: Pick<
    ReturnTypeFromUseStudentsContacts,
    'partyId' | 'relationshipType' | 'person'
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
  const { displayName } = usePreferredNameLayout();
  const relationshipOptions = Object.values(StudentContactType).map(
    (option) => ({
      value: option,
      label: t(`common:relationshipType.${option}`),
    })
  );

  const { reset, handleSubmit, setValue, watch } =
    useForm<ManageContactsFormValues>();

  const onSubmit = handleSubmit(({ contacts }) => {
    const linkContacts = contacts
      .filter(
        ({ partyId, relationshipType }) =>
          !currentContacts.find(
            (contact) =>
              contact.partyId === partyId &&
              contact.relationshipType === relationshipType
          )
      )
      .map(({ partyId, relationshipType }) => ({
        contactPartyId: partyId,
        relationshipType,
      }));
    const unlinkContacts = currentContacts
      .filter(
        ({ partyId, relationshipType }) =>
          !contacts.find(
            (contact) =>
              contact.partyId === partyId &&
              contact.relationshipType === relationshipType
          )
      )
      .map(({ partyId, relationshipType }) => ({
        contactPartyId: partyId,
        relationshipType,
      }));

    updateSiblingsAndContacts(
      {
        studentPartyId,
        linkSiblings: [],
        unlinkSiblings: [],
        linkContacts,
        unlinkContacts,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  });

  const contacts = watch('contacts');
  const disableRemoveButton = contacts?.length <= 1;
  const contactIds = useMemo(
    () => new Set(contacts?.map(({ partyId }) => partyId)),
    [contacts]
  );

  const removeContact = (contactPartyId: number) => {
    setValue(
      'contacts',
      contacts.filter(({ partyId }) => partyId !== contactPartyId)
    );
  };

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
        <Stack mt={0.75}>
          <ContactAutocomplete
            renderAvatarTags={() => null}
            multiple
            disableClearable
            isOptionEqualToValue={(option) => contactIds.has(option.partyId)}
            value={contacts ?? []}
            onChange={(_e, value) => {
              const typedValue = value as Array<
                | ContactSelectOption
                | Pick<
                    ReturnTypeFromUseStudentsContacts,
                    'partyId' | 'person' | 'relationshipType'
                  >
              >;
              if (!typedValue) {
                setValue('contacts', []);
              } else {
                setValue(
                  'contacts',
                  typedValue.map((person) => {
                    if ('person' in person) {
                      return person;
                    }
                    return {
                      partyId: person.partyId,
                      person,
                      relationshipType: StudentContactType.Other,
                    };
                  })
                );
              }
            }}
          />

          <Stack
            component="ul"
            sx={{
              mx: 0,
              my: 1,
              px: 0,
              '@media (hover: hover) and (pointer: fine)': {
                '& li:focus-within, & li:hover': {
                  bgcolor: 'primary.lighter',
                },
              },
            }}
          >
            {contacts?.map(({ partyId, person, relationshipType }, index) => (
              <Stack
                key={partyId}
                component="li"
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    src={person?.avatarUrl}
                    name={displayName(person)}
                    sx={{
                      my: 1,
                    }}
                  />
                  <Typography
                    component="h4"
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {displayName(person)}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Select
                    options={relationshipOptions}
                    optionIdKey="value"
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={relationshipType ?? ''}
                    sx={{
                      backgroundColor: 'background.neutral',
                      borderRadius: 1,
                    }}
                    onChange={(event) => {
                      const newValue = event.target.value as StudentContactType;
                      setValue(`contacts.${index}.relationshipType`, newValue);
                    }}
                  />
                  <Tooltip
                    title={
                      disableRemoveButton
                        ? t('people:studentMustHaveAContact')
                        : t('common:actions.remove')
                    }
                  >
                    <span>
                      <IconButton
                        aria-label={t('common:actions.remove')}
                        disabled={disableRemoveButton}
                        onClick={() => removeContact(person.partyId)}
                        color="primary"
                      >
                        <CloseIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
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
