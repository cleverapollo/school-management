import { Dialog, DialogTitle, DialogContent, DialogActions } from '@tyro/core';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect } from 'react';
import set from 'lodash/set';
import { ReturnTypeFromUseOptionsSolveBlocks } from '../../../api/solve/blocks';
import { SubjectStatsTable } from './subject-stats-table';
import { BlockOrganiser } from './block-organiser';
import { ReturnTypeFromUseOptionsSolutions } from '../../../api/options-solutions';

interface SolveSettingsModalProps {
  optionsSolutions: ReturnTypeFromUseOptionsSolutions;
  isOpen: boolean;
  onClose: () => void;
}

export function SolveSettingsModal({
  optionsSolutions,
  isOpen,
  onClose,
}: SolveSettingsModalProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const [blocksState, setBlocksState] =
    useState<ReturnTypeFromUseOptionsSolveBlocks>({ subjectSet: [] });

  const onChangeBlocks = (
    subjectSetId: NonNullable<
      ReturnTypeFromUseOptionsSolveBlocks['subjectSet'][number]
    >['subjectSet']['id'],
    newBlocks: NonNullable<
      ReturnTypeFromUseOptionsSolveBlocks['subjectSet'][number]
    >['blocks']
  ) => {
    setBlocksState((previousState) => {
      const clonedState = { ...previousState };
      const blockIndex =
        clonedState?.subjectSet?.findIndex(
          (blockSet) =>
            JSON.stringify(blockSet?.subjectSet.id) ===
            JSON.stringify(subjectSetId)
        ) ?? -1;

      if (blockIndex >= 0) {
        set(clonedState, `subjectSet[${blockIndex}].blocks`, newBlocks);
      }

      return clonedState;
    });
  };

  const onSave = () => {
    console.log('Save');
    onClose();
  };

  // useEffect(() => {
  //   if (optionsSolutions) {
  //     setBlocksState(optionsSolutions);
  //   }
  // }, [optionsSolutions]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle onClose={onClose}>
        {t('subjectOptions:solverSettings')}
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={3} useFlexGap>
          {/* <Stack>
            <Typography component="h3" variant="subtitle1">
              {t('common:blocks')}
            </Typography>
            {blocksState?.subjectSet.map((blockSet) => {
              if (!blockSet) return null;

              const { subjectSet, blocks } = blockSet;
              return (
                <BlockOrganiser
                  key={JSON.stringify(subjectSet.id)}
                  subjectSet={subjectSet}
                  blocks={blocks}
                  onChangeBlocks={onChangeBlocks}
                />
              );
            })}
          </Stack> */}
          {/* <SubjectStatsTable
            rowData={subjectStatsData ?? []}
            onRowDataChange={(newRowData) => {
              console.log({ newRowData });
            }}
          /> */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="soft" autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton variant="contained" onClick={onSave}>
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}