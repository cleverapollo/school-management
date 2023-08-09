import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeOfUseBlockList, useAutoAssignBlock } from '../../api/blocks';
import { useAutoAssignCore } from '../../api/classes';
import { YearGroupsAutocompleteProps } from './list-manager/year-groups-autocomplete';

interface AutoAssignConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  isBlockView: boolean;
  currentBlock: ReturnTypeOfUseBlockList[number] | null;
  currentYearGroup: YearGroupsAutocompleteProps['value'] | null;
}

export function AutoAssignConfirmDialog({
  open,
  onClose,
  isBlockView,
  currentBlock,
  currentYearGroup,
}: AutoAssignConfirmDialogProps) {
  const { t } = useTranslation(['classListManager']);

  const { mutateAsync: autoAssignBlock } = useAutoAssignBlock();
  const { mutateAsync: autoAssignCore } = useAutoAssignCore();

  return (
    <ConfirmDialog
      open={open}
      title={t('classListManager:autoAssign')}
      description={t('classListManager:autoAssignDescription')}
      confirmText={t('classListManager:autoAssignConfirm')}
      onClose={onClose}
      onConfirm={async () => {
        if (isBlockView && currentBlock) {
          await autoAssignBlock({ blockId: currentBlock.blockId });
        } else if (!isBlockView && currentYearGroup) {
          await autoAssignCore({
            yearGroupEnrollmentId: currentYearGroup.yearGroupEnrollmentPartyId,
          });
        }
        onClose();
      }}
    />
  );
}
