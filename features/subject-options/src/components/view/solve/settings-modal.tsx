import { Dialog, DialogTitle, DialogContent, DialogActions } from '@tyro/core';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect } from 'react';
import { SolutionStatus } from '@tyro/api';
import { SubjectStatsTable } from './subject-stats-table';
import { BlockOrganiser } from './block-organiser';
import { ReturnTypeFromUseOptionsSolutions } from '../../../api/options-solutions';
import { useSaveSolveSettings } from '../../../api/save-solve-settings';

interface SolveSettingsModalProps {
  optionsSolutions: ReturnTypeFromUseOptionsSolutions | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const defaultOptionsSolutions: ReturnTypeFromUseOptionsSolutions = {
  optionId: 0,
  pools: [],
  solverStatus: SolutionStatus.NotSolving,
};

export function SolveSettingsModal({
  optionsSolutions,
  isOpen,
  onClose,
}: SolveSettingsModalProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const [editableSolutionsCopy, setEditableSolutionsCopy] =
    useState<ReturnTypeFromUseOptionsSolutions>(defaultOptionsSolutions);

  const { mutateAsync: saveSolveSettings, isLoading: isSubmitting } =
    useSaveSolveSettings();

  const onSave = () => {
    saveSolveSettings(
      {
        optionId: editableSolutionsCopy.optionId,
        subjects: editableSolutionsCopy.pools.flatMap((pool) =>
          pool.subjects.map(({ poolIdx, subjectId, maxSize, numClasses }) => ({
            poolIdx,
            subjectId,
            maxSize,
            numberOfClasses: numClasses,
          }))
        ),
        subjectGroups: editableSolutionsCopy.pools.flatMap((pool) =>
          pool.blocks.flatMap(({ subjectGroups }) =>
            subjectGroups.flatMap(({ id, blockIdx, pinned, name }) => ({
              id,
              blockIdx,
              pinBlock: pinned,
              name,
            }))
          )
        ),
      },
      {
        onSuccess: onClose,
      }
    );
    onClose();
  };

  const cancel = () => {
    onClose();
    setTimeout(
      () =>
        setEditableSolutionsCopy(optionsSolutions ?? defaultOptionsSolutions),
      300
    );
  };

  useEffect(() => {
    if (optionsSolutions) {
      setEditableSolutionsCopy(optionsSolutions);
    }
  }, [optionsSolutions]);

  return (
    <Dialog open={isOpen} onClose={cancel} fullWidth maxWidth="xl">
      <DialogTitle onClose={cancel}>
        {t('subjectOptions:solverSettings')}
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={3} useFlexGap pb={2}>
          <Stack spacing={2} minWidth="40%">
            {editableSolutionsCopy?.pools.map(({ poolIdx, blocks }, index) => (
              <Stack key={poolIdx} spacing={1}>
                <Typography component="h3" variant="subtitle1">
                  {t('common:blocks')} -{' '}
                  {t('subjectOptions:poolN', {
                    number: poolIdx + 1,
                  })}
                </Typography>
                <BlockOrganiser
                  blocks={blocks}
                  onChangeBlocks={(newBlocks) => {
                    setEditableSolutionsCopy((previousState) => {
                      const clonedPools = [...previousState.pools];
                      clonedPools[index].blocks = newBlocks;
                      return {
                        ...previousState,
                        pools: clonedPools,
                      };
                    });
                  }}
                />
              </Stack>
            ))}
          </Stack>
          <Stack spacing={2} flex={1}>
            {editableSolutionsCopy?.pools.map(
              ({ poolIdx, subjects, blocks }, index) => (
                <Stack key={poolIdx} spacing={1}>
                  <Typography component="h3" variant="subtitle1">
                    {t('subjectOptions:subjectStats')} -{' '}
                    {t('subjectOptions:poolN', {
                      number: poolIdx + 1,
                    })}
                  </Typography>
                  <SubjectStatsTable
                    rowData={subjects ?? []}
                    blocks={blocks}
                    onRowDataChange={(newRowData) => {
                      setEditableSolutionsCopy((previousState) => {
                        const clonedPools = [...previousState.pools];
                        clonedPools[index].subjects = newRowData;
                        return {
                          ...previousState,
                          pools: clonedPools,
                        };
                      });
                    }}
                  />
                </Stack>
              )
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="soft" autoFocus onClick={cancel}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={isSubmitting}
          onClick={onSave}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
