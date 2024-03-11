import {
  EditedStudent,
  ListManager,
  ClassListSettingsProvider,
} from '@tyro/class-list-manager';
import {
  ActionMenu,
  ConfirmDialog,
  getNumber,
  useBreakpointValue,
  useDebouncedValue,
} from '@tyro/core';
import { useParams } from 'react-router-dom';
import { Stack, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import {
  OptionsSol_SubjectGroupMembershipChange,
  Options_MembershipChangeEnum,
} from '@tyro/api';
import { MaleFemaleIcon } from '@tyro/icons';
import {
  useOptionsClassLists,
  useUpdateOptionsSubjectGroupMemberships,
} from '../../api/options-class-list';
import {
  OptionsBlockAutocomplete,
  OptionsBlockAutocompleteValue,
} from '../../components/class-lists/blocks-autocomplete';

interface ConfirmDialogSettings {
  proceed: () => void;
  reset: () => void;
  title: string;
  confirmText: string;
}

export default function StudentOptionsClassListsPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation(['common', 'classListManager']);
  const [selectedBlock, setSelectedBlock] =
    useState<OptionsBlockAutocompleteValue | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const { spacing } = useTheme();
  const {
    value: confirmDialogSettings,
    debouncedValue: debouncedConfirmDialogSettings,
    setValue: setConfirmDialogSettings,
  } = useDebouncedValue<ConfirmDialogSettings | null>({ defaultValue: null });

  const dropdownDirection = useBreakpointValue<'column' | 'row'>({
    base: 'column',
    sm: 'row',
  });

  const { data } = useOptionsClassLists(
    {
      optionId,
      blockIdx: selectedBlock?.blockIdx ?? 0,
    },
    Boolean(optionId && selectedBlock?.blockIdx !== null)
  );
  const { mutateAsync: updateSubjectGroupMemberships } =
    useUpdateOptionsSubjectGroupMemberships();

  const classListData = useMemo(() => {
    if (!data) return null;

    const mappedGroups = data.subjectGroups.map(
      ({ id: partyId, subjectGroupName, students }) => ({
        partyId,
        name: subjectGroupName,
        students: students.map(
          ({ person, classGroup, personalInformation }) => ({
            id: person.partyId.toString(),
            person,
            classGroupName: classGroup?.name,
            gender: personalInformation?.gender,
          })
        ),
      })
    );

    return {
      id: data.id,
      groups: mappedGroups.filter(({ name }) => name !== 'Unassigned'),
      unenrolledStudents:
        mappedGroups.find(({ name }) => name === 'Unassigned')?.students ?? [],
    };
  }, [data]);

  const requestSetSelectedBlock = (
    block: OptionsBlockAutocompleteValue | null
  ) => {
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

  const onBulkSave = async (edited: EditedStudent[]) => {
    const membershipChange = edited.reduce(
      (acc, { student, sourceGroup, destinationGroup }) => {
        if (sourceGroup && sourceGroup.id !== 'unassigned') {
          acc.push({
            studentPartyId: student.person.partyId ?? 0,
            subjectGroupId: sourceGroup.id,
            type: Options_MembershipChangeEnum.Remove,
          });
        }

        if (destinationGroup && destinationGroup.id !== 'unassigned') {
          acc.push({
            studentPartyId: student.person.partyId,
            subjectGroupId: destinationGroup.id,
            type: Options_MembershipChangeEnum.Add,
          });
        }

        return acc;
      },
      [] as OptionsSol_SubjectGroupMembershipChange[]
    );

    return updateSubjectGroupMemberships({
      optionId,
      membershipChange,
    });
  };

  return (
    <ClassListSettingsProvider showGender={showGender} removeContainerMargin>
      <Stack spacing={3}>
        <Stack
          direction={dropdownDirection}
          spacing={2}
          useFlexGap
          justifyContent="space-between"
          alignItems="center"
        >
          <OptionsBlockAutocomplete
            value={selectedBlock}
            optionId={optionId}
            onChange={requestSetSelectedBlock}
            sx={{ maxWidth: spacing(54), flex: 1 }}
          />
          <ActionMenu
            menuItems={[
              {
                label: showGender
                  ? t('classListManager:deactivateGenderView')
                  : t('classListManager:activateGenderView'),
                icon: <MaleFemaleIcon />,
                onClick: () => setShowGender((prevState) => !prevState),
              },
            ]}
          />
        </Stack>
        {classListData && (
          <ListManager
            listKey={`${selectedBlock?.blockIdx ?? 0}-${classListData.id}`}
            unassignedStudents={classListData.unenrolledStudents}
            groups={classListData.groups}
            onBulkSave={onBulkSave}
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
    </ClassListSettingsProvider>
  );
}
