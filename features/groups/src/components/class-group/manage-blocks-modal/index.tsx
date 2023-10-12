import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Core_ModifyBlockClassGroup,
  Core_ModifyMembershipEnum,
} from '@tyro/api';
import { useModifyBlocks } from '../../../api/modify-blocks';
import { BlockListContainer, BlockListItem } from './blocks-list';
import {
  ReturnTypeOfUseBlocksList,
  useBlocksList,
} from '../../../api/blocks-list';

export interface ManageBlocksModalProps {
  open: boolean;
  onClose: () => void;
  currentBlocksString: string[];
  classGroupId: number;
}

export function ManageBlocksModal({
  open,
  onClose,
  currentBlocksString,
  classGroupId,
}: ManageBlocksModalProps) {
  const { data: allBlocks } = useBlocksList({});
  const { t } = useTranslation(['common', 'timetable', 'groups']);
  const { mutateAsync: modifyBlocks, isLoading } = useModifyBlocks();

  const originalBlocks = useMemo(
    () =>
      allBlocks?.filter((b) => currentBlocksString.includes(b.blockId)) ?? [],
    [allBlocks, currentBlocksString]
  );
  useEffect(() => {
    setCurrentBlocks(originalBlocks);
  }, [originalBlocks]);

  const [currentBlocks, setCurrentBlocks] = useState(originalBlocks);
  const [removeBlocks, setRemoveBlocks] = useState<ReturnTypeOfUseBlocksList>(
    []
  );
  const [addBlocks, setAddBlock] = useState<ReturnTypeOfUseBlocksList>([]);
  const removeEnrolledSibling = (blockId: string) => {
    const selectedBlock = allBlocks?.find((block) => block.blockId === blockId);
    if (selectedBlock) {
      setCurrentBlocks(currentBlocks.filter((b) => b.blockId !== blockId));
      if (currentBlocksString.includes(selectedBlock.blockId)) {
        setRemoveBlocks([...removeBlocks, selectedBlock]);
      }
      if (!currentBlocksString.includes(selectedBlock.blockId)) {
        setAddBlock(addBlocks.filter((b) => b.blockId !== blockId));
      }
    }
  };

  const addBlock = (v: SelectChangeEvent) => {
    const selectedBlock = allBlocks?.find(
      (block) => block.blockId === v.target?.value
    );
    if (selectedBlock) {
      setCurrentBlocks([...currentBlocks, selectedBlock]);
      if (!currentBlocksString.includes(selectedBlock.blockId)) {
        setAddBlock([...addBlocks, selectedBlock]);
      }
      if (currentBlocksString.includes(selectedBlock.blockId)) {
        setRemoveBlocks(
          removeBlocks.filter((b) => b.blockId !== selectedBlock.blockId)
        );
      }
    }
  };
  const closeAndResetModal = () => {
    setCurrentBlocks([]);
    setAddBlock([]);
    setRemoveBlocks([]);
    onClose();
  };
  const handleSave = async () => {
    const blocksToAdd = addBlocks.map(
      (block) =>
        ({
          blockId: block.blockId,
          classGroupId,
          change: Core_ModifyMembershipEnum.Add,
        } as Core_ModifyBlockClassGroup)
    );
    const blocksToRemove = removeBlocks.map(
      (block) =>
        ({
          blockId: block.blockId,
          classGroupId,
          change: Core_ModifyMembershipEnum.Remove,
        } as Core_ModifyBlockClassGroup)
    );
    await modifyBlocks({
      changeClassGroups: [...blocksToAdd, ...blocksToRemove],
    });
    closeAndResetModal();
  };

  return (
    <Dialog open={open} onClose={closeAndResetModal} fullWidth maxWidth="sm">
      <DialogTitle onClose={onClose}>{t('groups:manageBlocks')}</DialogTitle>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <Box sx={{ px: 3, pt: 1 }}>
          <>
            <InputLabel id="demo-simple-select-label">
              {t('groups:addBlock')}
            </InputLabel>
            {/* todo change to our select boxes, couoldn\t figure out how to work them */}
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              defaultValue=""
              onChange={addBlock}
            >
              {allBlocks &&
                allBlocks.map((block) => (
                  <MenuItem key={block.blockId} value={block.blockId}>
                    {block.blockId}
                  </MenuItem>
                ))}
            </Select>
            <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
              {t('groups:partOfBlocks')}
            </Typography>
            <BlockListContainer>
              {currentBlocks &&
                currentBlocks.map((block) => (
                  <BlockListItem
                    key={block.blockId}
                    block={block}
                    onRemove={removeEnrolledSibling}
                  >
                    <Typography
                      component="h4"
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {block.blockId}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {block.subjectGroupNamesJoined}
                    </Typography>
                  </BlockListItem>
                ))}
            </BlockListContainer>
          </>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="soft"
          onClick={() => {
            closeAndResetModal();
          }}
        >
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={() => {
            handleSave();
          }}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
