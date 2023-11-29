import { Box, Button, DialogContent, Stack } from '@mui/material';
import { Dialog, DialogActions, DialogTitle, useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { PartyGroupType, Print_GroupMembersOptions } from '@tyro/api';
import { RecipientsForSmsModal } from '@tyro/sms';
import { GroupTypeAutocomplete } from './group-type-autocomplete';
import { getPrintPersonsGroupMemberships } from '../../api/common/print-group-memberships';

interface BulkPrintPersonsGroupsMembershipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: RecipientsForSmsModal;
}

export function BulkPrintPersonsGroupsMembershipsModal({
  isOpen,
  onClose,
  groups,
}: BulkPrintPersonsGroupsMembershipsModalProps) {
  const { t } = useTranslation(['common', 'people']);
  const { toast } = useToast();
  const [groupTypes, setGroupTypes] = useState<PartyGroupType[]>([
    PartyGroupType.SubjectGroup,
  ]);

  const handlePrint = async (options: Print_GroupMembersOptions) => {
    try {
      const personIds = groups.map(({ id }) => id) ?? [];
      const printResponse = await getPrintPersonsGroupMemberships({
        personIds,
        options,
        groupTypes,
      });

      if (printResponse?.print_personsGroupMemberships?.url)
        window.open(
          printResponse.print_personsGroupMemberships.url,
          '_blank',
          'noreferrer'
        );
      handleClose();
    } catch {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    }
  };

  const handleClose = () => {
    setGroupTypes([PartyGroupType.SubjectGroup]);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('people:printGroupMemberships')}</DialogTitle>
      <DialogContent sx={{ pt: 0.75 }}>
        <GroupTypeAutocomplete
          value={groupTypes}
          onChange={(_, newValue) =>
            setGroupTypes(newValue as PartyGroupType[])
          }
        />
      </DialogContent>
      <DialogActions>
        <Button variant="soft" color="inherit" onClick={handleClose}>
          {t('common:actions.cancel')}
        </Button>

        {/* Hiding till backend is done  */}
        {/* <Button
          variant="contained"
          onClick={() => handlePrint(Print_GroupMembersOptions.Csv)}
        >
          {t('common:actions.exportCSV')}
        </Button> */}

        <Button
          variant="contained"
          onClick={() => handlePrint(Print_GroupMembersOptions.Print)}
        >
          {t('common:actions.print')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
