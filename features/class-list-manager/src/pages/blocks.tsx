import { Stack, useTheme } from '@mui/material';
import {
  EnrollmentIre_BlockMembershipChange,
  EnrollmentIre_MembershipChangeEnum,
} from '@tyro/api';
import {
  ConfirmDialog,
  useBreakpointValue,
  useDebouncedValue,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState, useMemo } from 'react';

import { useBlockMemberships, useUpdateBlockMemberships } from '../api/blocks';
import {
  BlockAutocomplete,
  BlockAutocompleteProps,
} from '../components/blocks/block-autocomplete';
import { RotationSelect } from '../components/blocks/rotation-select';
import { ListManager } from '../components/common/list-manager';
import { EditedStudent } from '../components/common/list-manager/state/edited-state';
import { useContainerMargin } from '../hooks/use-container-margin';
import {
  YearGroupsAutocomplete,
  YearGroupsAutocompleteProps,
} from '../components/common/list-manager/year-groups-autocomplete';
import { useClassListSettings } from '../store/class-list-settings';

interface ConfirmDialogSettings {
  proceed: () => void;
  reset: () => void;
  title: string;
  confirmText: string;
}

export default function ClassListManagerBlocks() {
  const { spacing } = useTheme();
  const { t } = useTranslation(['common', 'classListManager']);

  const [selectedRotationIndex, setSelectedRotationIndex] = useState<
    number | string
  >(0);
  const {
    value: confirmDialogSettings,
    debouncedValue: debouncedConfirmDialogSettings,
    setValue: setConfirmDialogSettings,
  } = useDebouncedValue<ConfirmDialogSettings | null>({ defaultValue: null });
  const [isDirty, setIsDirty] = useState(false);
  const containerMargin = useContainerMargin();
  const {
    selectedBlock,
    setSelectedBlock,
    selectedYearGroup,
    setSelectedYearGroup,
  } = useClassListSettings();
  const dropdownDirection = useBreakpointValue<'column' | 'row'>({
    base: 'column',
    sm: 'row',
  });

  const { data } = useBlockMemberships(selectedBlock?.blockId ?? null);
  const { mutateAsync: saveBlockMemberships } = useUpdateBlockMemberships();

  const blockData = useMemo(() => {
    const blockIndex = !selectedBlock?.isRotation ? 0 : selectedRotationIndex;

    return data && typeof blockIndex === 'number'
      ? data.groups[blockIndex]
      : null;
  }, [selectedBlock, selectedRotationIndex, data?.groups]);

  const onSelectedYearGroup = (
    yearGroup: YearGroupsAutocompleteProps['value']
  ) => {
    setSelectedYearGroup(yearGroup);
    setSelectedBlock(null);
  };

  const requestSetSelectedYearGroup = (
    yearGroup: YearGroupsAutocompleteProps['value']
  ) => {
    if (isDirty) {
      setConfirmDialogSettings({
        title: t('classListManager:areYouSureYouWantToChangeYear'),
        confirmText: t('classListManager:changeYear'),
        proceed: () => {
          onSelectedYearGroup(yearGroup);
        },
        reset: () => {
          setConfirmDialogSettings(null);
        },
      });
    } else {
      onSelectedYearGroup(yearGroup);
    }
  };

  const requestSetSelectedBlock = (block: BlockAutocompleteProps['value']) => {
    if (isDirty) {
      setConfirmDialogSettings({
        title: t('classListManager:areYouSureYouWantToChangeBlock'),
        confirmText: t('classListManager:changeBlock'),
        proceed: () => {
          setSelectedBlock(block);
        },
        reset: () => {
          setConfirmDialogSettings(null);
        },
      });
    } else {
      setSelectedBlock(block);
    }
  };

  const requestSetSelectedRotationIndex = (rotationIndex: number | string) => {
    if (isDirty) {
      setConfirmDialogSettings({
        title: t('classListManager:areYouSureYouWantToChangeRotation'),
        confirmText: t('classListManager:changeRotation'),
        proceed: () => {
          setSelectedRotationIndex(rotationIndex);
        },
        reset: () => {
          setConfirmDialogSettings(null);
        },
      });
    } else {
      setSelectedRotationIndex(rotationIndex);
    }
  };

  const onBulkSave = async (edited: EditedStudent[]) => {
    const membershipChange = edited.reduce(
      (acc, { student, sourceGroup, destinationGroup }) => {
        if (sourceGroup && sourceGroup.id !== 'unassigned') {
          acc.push({
            studentId: student.person.partyId ?? 0,
            subjectGroupId: sourceGroup.id,
            type: EnrollmentIre_MembershipChangeEnum.Remove,
          });
        }

        if (destinationGroup && destinationGroup.id !== 'unassigned') {
          acc.push({
            studentId: student.person.partyId,
            subjectGroupId: destinationGroup.id,
            type: EnrollmentIre_MembershipChangeEnum.Add,
          });
        }

        return acc;
      },
      [] as EnrollmentIre_BlockMembershipChange[]
    );

    return saveBlockMemberships({
      blockId: selectedBlock?.blockId ?? '',
      membershipChange,
    });
  };

  useEffect(() => {
    setSelectedRotationIndex(0);
  }, [selectedBlock]);

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={dropdownDirection}
          spacing={2}
          sx={{ px: containerMargin }}
        >
          <YearGroupsAutocomplete
            value={selectedYearGroup}
            onChange={requestSetSelectedYearGroup}
            sx={{ maxWidth: spacing(34), flex: 1 }}
          />
          {selectedYearGroup && (
            <>
              <BlockAutocomplete
                value={selectedBlock}
                yearGroupId={selectedYearGroup.yearGroupId}
                onChange={requestSetSelectedBlock}
                sx={{ maxWidth: spacing(54), flex: 1 }}
              />
              {selectedBlock?.isRotation && (
                <RotationSelect
                  value={selectedRotationIndex}
                  rotations={selectedBlock.rotations}
                  onChange={requestSetSelectedRotationIndex}
                  sx={{ maxWidth: spacing(34), flex: 1 }}
                />
              )}
            </>
          )}
        </Stack>
        {blockData && (
          <ListManager
            listKey={`${selectedBlock?.blockId ?? ''}-${
              selectedRotationIndex ?? ''
            }-${data?.id ?? ''}`}
            unassignedStudents={blockData.unenrolledStudents}
            groups={blockData.subjectGroups}
            onBulkSave={onBulkSave}
            enableDuplicateStudents
            onIsDirtyChange={setIsDirty}
            includeClassGroupName
          />
        )}
      </Stack>
      <ConfirmDialog
        open={!!confirmDialogSettings}
        title={
          (confirmDialogSettings || debouncedConfirmDialogSettings)?.title ?? ''
        }
        description={t('common:confirmDialog.youHaveUnsavedChanges')}
        confirmText={
          (confirmDialogSettings || debouncedConfirmDialogSettings)
            ?.confirmText ?? ''
        }
        onConfirm={() => confirmDialogSettings?.proceed?.()}
        onClose={() => confirmDialogSettings?.reset?.()}
      />
    </>
  );
}
