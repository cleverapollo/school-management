import { Box, Button, Typography } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { SubjectGroupStudentMembershipTypeEnum } from '@tyro/api';
import {
  ReturnTypeOfUseSubjectGroupList,
  useSubjectGroups,
} from '../../../api';
import { useModifySubjectGroup } from '../../../api/modify-subject-group';
import {
  SubjectGroupListContainer,
  SubjectGroupListItem,
} from './subject-group-list';

export interface ManageCoreSubjectGroupsModalProps {
  open: boolean;
  onClose: () => void;
  currentCoreSubjectGroupString: number[];
  classGroupId: number;
}

export function ManageCoreSubjectGroupsModal({
  open,
  onClose,
  currentCoreSubjectGroupString,
  classGroupId,
}: ManageCoreSubjectGroupsModalProps) {
  const { data: allSubjectGroups, isLoading: isFetching } = useSubjectGroups();
  const { t } = useTranslation(['common', 'timetable', 'groups']);
  const { mutateAsync: modifySubjectGroup } = useModifySubjectGroup();
  const [isLoading, setIsLoading] = useState(false);

  const originalSubjectGroups = useMemo(
    () =>
      allSubjectGroups?.filter((s) =>
        currentCoreSubjectGroupString.includes(s.partyId)
      ) ?? [],
    [allSubjectGroups, currentCoreSubjectGroupString]
  );

  const [currentSubjectGroups, setCurrentSubjectGroups] = useState(
    originalSubjectGroups
  );

  const [addSubjectGroups, setAddSubjectGroup] =
    useState<ReturnTypeOfUseSubjectGroupList>([]);

  const addSubjectGroup = (v: ReturnTypeOfUseSubjectGroupList[number]) => {
    const selectedSubjectGroup = allSubjectGroups?.find(
      (subjectGroup) => subjectGroup.partyId === v.partyId
    );
    if (selectedSubjectGroup) {
      setCurrentSubjectGroups([...currentSubjectGroups, selectedSubjectGroup]);
      if (
        !currentCoreSubjectGroupString.includes(selectedSubjectGroup.partyId)
      ) {
        setAddSubjectGroup([...addSubjectGroups, selectedSubjectGroup]);
      }
    }
  };

  const closeAndResetModal = () => {
    setCurrentSubjectGroups([]);
    setAddSubjectGroup([]);
    onClose();
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const subjectGroupsToAdd = addSubjectGroups.map((subjectGroup) => ({
        subjectGroupId: subjectGroup.partyId,
        blockId: null,
        classGroupId,
        membershipType: SubjectGroupStudentMembershipTypeEnum.Core,
      }));
      await modifySubjectGroup(subjectGroupsToAdd);
      closeAndResetModal();
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentSubjectGroups(originalSubjectGroups);
  }, [originalSubjectGroups]);

  return (
    <Dialog open={open} onClose={closeAndResetModal} fullWidth maxWidth="sm">
      <DialogTitle onClose={onClose}>
        {t('groups:manageCoreSubjectGroups')}
      </DialogTitle>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <Box sx={{ px: 3, pt: 1 }}>
          <>
            <Autocomplete
              optionIdKey="partyId"
              options={allSubjectGroups ?? []}
              loading={isFetching}
              optionTextKey="name"
              label={t('groups:addSubjectGroup')}
              fullWidth
              onChange={(_, newValue) =>
                newValue !== null &&
                addSubjectGroup(
                  newValue as ReturnTypeOfUseSubjectGroupList[number]
                )
              }
            />
            <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
              {t('groups:partOfSubjectGroups')}
            </Typography>
            <SubjectGroupListContainer>
              {currentSubjectGroups &&
                currentSubjectGroups.map((subjectGroup) => (
                  <SubjectGroupListItem key={subjectGroup.partyId}>
                    <Typography
                      component="h4"
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {subjectGroup.name}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {subjectGroup.staff
                        .map(
                          (staff) =>
                            `${staff?.firstName ?? ''} ${staff?.lastName ?? ''}`
                        )
                        .join(', ')}
                    </Typography>
                  </SubjectGroupListItem>
                ))}
            </SubjectGroupListContainer>
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
