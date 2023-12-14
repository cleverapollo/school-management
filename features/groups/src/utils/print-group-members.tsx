import { RecipientsForSmsModal } from '@tyro/sms';
import { Print_GroupMembersOptions } from '@tyro/api';
import { getPrintGroupMembers } from '../api/print-group-members';

type PrintGroupMembersFn = (
  groups: RecipientsForSmsModal,
  options?: Print_GroupMembersOptions
) => void;

export const printGroupMembers: PrintGroupMembersFn = async (
  groups,
  options = Print_GroupMembersOptions.Print
) => {
  const groupIds = (groups || []).map(({ id }) => id);

  const printResponse = await getPrintGroupMembers({
    groupIds,
    options,
  });

  const url = printResponse?.print_groupMembers?.url;

  if (url) {
    window.open(url, '_blank', 'noreferrer');
  }
};
