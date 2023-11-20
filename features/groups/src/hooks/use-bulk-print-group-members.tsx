import { RecipientsForSmsModal } from '@tyro/sms';
import { PrinterIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Print_GroupMembersOptions } from '@tyro/api';
import { getPrintGroupMembers } from '../api/print-group-members';

type UseBulkPrintGroupMembersParams = {
  groups: RecipientsForSmsModal;
};

export function useBulkPrintGroupMembers({
  groups,
}: UseBulkPrintGroupMembersParams) {
  const { t } = useTranslation(['groups']);

  const handleBulkPrint = async () => {
    const groupIds = groups.map(({ id }) => id) ?? [];

    const printResponse = await getPrintGroupMembers({
      groupIds,
      options: Print_GroupMembersOptions.Csv,
    });

    if (
      printResponse &&
      printResponse.print_groupMembers &&
      printResponse.print_groupMembers.url
    )
      window.open(printResponse.print_groupMembers.url, '_blank', 'noreferrer');
  };

  return {
    label: t('groups:printGroupMembers'),
    icon: <PrinterIcon />,
    onClick: handleBulkPrint,
  };
}
