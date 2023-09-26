import { alpha, Chip, Tooltip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { IconChip, useDisclosure, getBaseColorBasedOnString } from '@tyro/core';
import { GearIcon } from '@tyro/icons';

import { ReturnTypeFromUseClassGroupById } from '../../api/class-groups';
import { ManageBlocksModal } from './manage-blocks-modal';

interface BlocksChipsProps {
  blocks: ReturnTypeFromUseClassGroupById['blocks'];
  classGroupId: number;
}

export function BlocksChips({ blocks, classGroupId }: BlocksChipsProps) {
  const { t } = useTranslation(['common', 'groups']);
  const { isOpen, onClose, onOpen } = useDisclosure();

  if (blocks?.length === 0) {
    return <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />;
  }

  return (
    <>
      {blocks.map((block) => {
        const name = block.blockId;
        const colorKey = getBaseColorBasedOnString(name);

        return (
          <Chip
            key={name}
            label={name}
            sx={({ palette }) => ({
              color: 'text.primary',
              backgroundColor: alpha(palette[colorKey][500], 0.16),
            })}
          />
        );
      })}
      <Tooltip title={t('groups:manageBlocks')}>
        <IconChip
          aria-label={t('groups:manageBlocks')}
          icon={<GearIcon />}
          onClick={() => onOpen()}
        />
      </Tooltip>
      <ManageBlocksModal
        open={isOpen}
        classGroupId={classGroupId}
        onClose={() => onClose()}
        currentBlocksString={blocks.map((b) => b.blockId) ?? []}
        // currentStudent={currentStudent}
        // currentSiblings={
        //   siblings ?? { enrolledSiblings: [], nonEnrolledSiblings: [] }
      />
    </>
  );
}
