import { Box, Button, DialogContent, Stack } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@tyro/core';
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
  staffKey: string;
}

export function BulkPrintPersonsGroupsMembershipsModal({
  isOpen,
  onClose,
  groups,
  staffKey,
}: BulkPrintPersonsGroupsMembershipsModalProps) {
  const { t } = useTranslation(['common', 'people']);
  const [groupTypes, setGroupTypes] = useState<PartyGroupType[]>([]);

  const handlePrint = async () => {
    const groupIds = groups.map(({ id }) => id) ?? [];

    const printResponse = await getPrintPersonsGroupMemberships(
      {
        groupIds,
        options: Print_GroupMembersOptions.Csv,
        groupTypes,
      },
      staffKey
    );

    if (printResponse?.print_personsGroupMemberships?.url)
      window.open(
        printResponse?.print_personsGroupMemberships?.url,
        '_blank',
        'noreferrer'
      );
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{t('people:printGroupMemberships')}</DialogTitle>
      <DialogContent sx={{ pb: 4, overflow: 'visible' }}>
        <GroupTypeAutocomplete
          value={groupTypes}
          onChange={(_, newValue) =>
            setGroupTypes(newValue as PartyGroupType[])
          }
        />
      </DialogContent>
      <DialogActions
        sx={{
          borderTopColor: 'slate.200',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          p: '0 !important',
        }}
      >
        <Stack direction="row" sx={{ py: 1.5, flex: 1 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1.5}
              sx={{ px: 3, flex: 1 }}
            >
              <Button variant="soft" onClick={onClose}>
                {t('common:actions.cancel')}
              </Button>

              <Button variant="contained" onClick={handlePrint}>
                {t('common:actions.print')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
