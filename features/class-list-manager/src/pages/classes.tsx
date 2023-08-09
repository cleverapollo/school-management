import { Stack, useTheme } from '@mui/material';
import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  EnrollmentIre_MembershipChangeEnum,
  EnrollmentIre_CoreMembershipChange,
} from '@tyro/api';
import { useState } from 'react';
import { useClassMemberships, useUpdateClassMemberships } from '../api/classes';
import {
  YearGroupsAutocomplete,
  YearGroupsAutocompleteProps,
} from '../components/common/list-manager/year-groups-autocomplete';
import { ListManager } from '../components/common/list-manager';
import { EditedStudent } from '../components/common/list-manager/state/edited-state';
import { useContainerMargin } from '../hooks/use-container-margin';
import { useClassListSettings } from '../store/class-list-settings';

interface ConfirmDialogSettings {
  proceed: () => void;
  reset: () => void;
}

export default function ClassListManagerClasses() {
  const { spacing } = useTheme();
  const { t } = useTranslation(['common', 'classListManager']);

  const { selectedYearGroup, setSelectedYearGroup } = useClassListSettings();
  const [isDirty, setIsDirty] = useState(false);
  const containerMargin = useContainerMargin();
  const [confirmDialogSettings, setConfirmDialogSettings] =
    useState<ConfirmDialogSettings | null>(null);

  const { data: classData } = useClassMemberships(
    selectedYearGroup?.yearGroupEnrollmentPartyId
  );
  const { mutateAsync: saveClassMemberships } = useUpdateClassMemberships();

  const requestSetSelectedYearGroup = (
    year: YearGroupsAutocompleteProps['value']
  ) => {
    if (isDirty) {
      setConfirmDialogSettings({
        proceed: () => {
          setSelectedYearGroup(year);
        },
        reset: () => {
          setConfirmDialogSettings(null);
        },
      });
    } else {
      setSelectedYearGroup(year);
    }
  };

  const onBulkSave = async (edited: EditedStudent[]) => {
    const membershipChange = edited.reduce(
      (acc, { student, sourceGroup, destinationGroup }) => {
        if (sourceGroup && sourceGroup.id !== 'unassigned') {
          acc.push({
            studentId: student.person.partyId ?? 0,
            classGroupId: sourceGroup.id,
            type: EnrollmentIre_MembershipChangeEnum.Remove,
          });
        }

        if (destinationGroup && destinationGroup.id !== 'unassigned') {
          acc.push({
            studentId: student.person.partyId,
            classGroupId: destinationGroup.id,
            type: EnrollmentIre_MembershipChangeEnum.Add,
          });
        }

        return acc;
      },
      [] as EnrollmentIre_CoreMembershipChange[]
    );

    return saveClassMemberships({
      yearGroupEnrollmentId: selectedYearGroup?.yearGroupEnrollmentPartyId ?? 0,
      membershipChange,
    });
  };

  return (
    <>
      <Stack spacing={3}>
        <YearGroupsAutocomplete
          value={selectedYearGroup}
          onChange={requestSetSelectedYearGroup}
          sx={{ maxWidth: spacing(54), flex: 1, px: containerMargin }}
        />
        {classData && (
          <ListManager
            listKey={`${selectedYearGroup?.yearGroupEnrollmentPartyId ?? ''}-${
              classData?.id ?? ''
            }`}
            unassignedStudents={classData.unenrolledStudents}
            groups={classData.classGroups}
            onBulkSave={onBulkSave}
            onIsDirtyChange={setIsDirty}
          />
        )}
      </Stack>
      <ConfirmDialog
        open={!!confirmDialogSettings}
        title={t('classListManager:areYouSureYouWantToChangeYear')}
        description={t('common:confirmDialog.youHaveUnsavedChanges')}
        confirmText={t('classListManager:changeYear')}
        onConfirm={() => confirmDialogSettings?.proceed?.()}
        onClose={() => confirmDialogSettings?.reset?.()}
      />
    </>
  );
}
