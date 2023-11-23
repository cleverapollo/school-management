import { Box, Button, Stack } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Print_GroupMembersOptions } from '@tyro/api';
import { RecipientsForSmsModal } from '@tyro/sms';
import { getPrintGroupMembers } from '../../api/print-group-members';

interface BulkPrintGroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: RecipientsForSmsModal;
}

export function BulkPrintGroupMembersModal({
  isOpen,
  onClose,
  groups,
}: BulkPrintGroupMembersModalProps) {
  const { t } = useTranslation(['common', 'groups']);

  const handlePrint = async (options: Print_GroupMembersOptions) => {
    const groupIds = groups.map(({ id }) => id) ?? [];

    const printResponse = await getPrintGroupMembers({
      groupIds,
      options,
    });

    if (printResponse?.print_groupMembers?.url)
      window.open(printResponse.print_groupMembers.url, '_blank', 'noreferrer');
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
      <DialogTitle>{t('groups:printGroupMembers')}</DialogTitle>
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

              <Button
                variant="contained"
                onClick={() => handlePrint(Print_GroupMembersOptions.Csv)}
              >
                {t('common:actions.exportCSV')}
              </Button>

              <Button
                variant="contained"
                onClick={() => handlePrint(Print_GroupMembersOptions.Print)}
              >
                {t('common:actions.print')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
