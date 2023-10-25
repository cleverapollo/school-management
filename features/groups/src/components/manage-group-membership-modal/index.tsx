import { Box, Button, Chip, Typography } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Core_ModifyMembershipEnum,
  Core_ModifyStudentSubjectGroupMembership,
  SubjectGroupType,
} from '@tyro/api';
import {
  StudentAutocomplete,
  StudentSelectOption,
  StudentsSelectOption,
  useStudentsForSelect,
} from '@tyro/people';
import { useSubjectGroupByFilter } from '../../api/subject-groups';
import { StudentListContainer, StudentListItems } from './student-list';
import { useModifyGroupMemberships } from '../../api/modify-group-memberships';

export interface ManageGroupMembershipModalProps {
  open: boolean;
  onClose: () => void;
  subjectGroupId: number;
}

export function ManageSubjectGroupMembership({
  open,
  onClose,
  subjectGroupId,
}: ManageGroupMembershipModalProps) {
  const { data: subjectGroup } = useSubjectGroupByFilter({
    partyIds: [subjectGroupId],
    type: [SubjectGroupType.SubjectGroup, SubjectGroupType.SupportGroup],
  });
  const { displayName } = usePreferredNameLayout();
  const { data: allStudents } = useStudentsForSelect({});
  const { t } = useTranslation(['common', 'timetable', 'groups']);
  const { mutateAsync: modify, isLoading } = useModifyGroupMemberships();

  const originalStudentIds = useMemo(
    () => subjectGroup?.students.map((s) => s.partyId) ?? [],
    [subjectGroup]
  );
  const originalStudents = useMemo(
    () =>
      allStudents?.filter((s) => originalStudentIds?.includes(s.partyId)) ?? [],
    [originalStudentIds, allStudents]
  );

  useEffect(() => {
    setCurrentStudents(originalStudents);
  }, [originalStudents]);

  const [currentStudents, setCurrentStudents] = useState(originalStudents);
  const [removeStudents, setRemoveStudents] = useState<StudentsSelectOption>(
    []
  );
  const [addStudents, setAddStudent] = useState<StudentsSelectOption>([]);
  const removeEnrolledSibling = (selectedStudent: StudentSelectOption) => {
    if (selectedStudent) {
      setCurrentStudents(
        currentStudents.filter((b) => b.partyId !== selectedStudent.partyId)
      );
      if (originalStudentIds.includes(selectedStudent.partyId)) {
        setRemoveStudents([...removeStudents, selectedStudent]);
      }
      if (!originalStudentIds.includes(selectedStudent.partyId)) {
        setAddStudent(
          addStudents.filter((b) => b.partyId !== selectedStudent.partyId)
        );
      }
    }
  };

  const addBlock = (selectedStudent: StudentSelectOption) => {
    if (selectedStudent) {
      if (!originalStudentIds.includes(selectedStudent.partyId)) {
        setAddStudent([...addStudents, selectedStudent]);
      }
      if (originalStudentIds.includes(selectedStudent.partyId)) {
        setRemoveStudents(
          removeStudents.filter((b) => b.partyId !== selectedStudent.partyId)
        );
      }
    }
  };
  const closeAndResetModal = () => {
    setAddStudent([]);
    setRemoveStudents([]);
    onClose();
  };
  const handleSave = async () => {
    const studentsToAdd = addStudents.map(
      (student) =>
        ({
          studentPartyId: student.partyId,
          groupPartyId: subjectGroupId,
          change: Core_ModifyMembershipEnum.Add,
        } as Core_ModifyStudentSubjectGroupMembership)
    );
    const toRemove = removeStudents.map(
      (student) =>
        ({
          studentPartyId: student.partyId,
          groupPartyId: subjectGroupId,
          change: Core_ModifyMembershipEnum.Remove,
        } as Core_ModifyStudentSubjectGroupMembership)
    );
    await modify({
      studentSubjectGroupMemberships: [...studentsToAdd, ...toRemove],
    });
    closeAndResetModal();
  };

  return (
    <Dialog open={open} onClose={closeAndResetModal} fullWidth maxWidth="sm">
      <DialogTitle onClose={onClose}>
        {t('groups:namedMemberList', {
          groupName: subjectGroup?.name ?? '',
        })}
      </DialogTitle>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <Box sx={{ px: 3, pt: 1 }}>
          <>
            {/* todo change to our select boxes, couoldn\t figure out how to work them */}
            <StudentAutocomplete
              fullWidth
              optionIdKey="partyId"
              onChange={(_e, value) => {
                addBlock(value as StudentSelectOption);
              }}
            />

            <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
              {t('groups:members')}
            </Typography>
            <StudentListContainer>
              {removeStudents &&
                removeStudents.map((student) => (
                  <StudentListItems
                    key={student.partyId}
                    student={student}
                    onRemove={addBlock}
                    undoIcon
                  >
                    <Typography
                      component="h4"
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {displayName(student)}
                      <Chip
                        label="Remove"
                        size="small"
                        variant="soft"
                        color="red"
                        sx={{ mx: 2 }}
                      />
                    </Typography>
                  </StudentListItems>
                ))}
            </StudentListContainer>
            <StudentListContainer>
              {addStudents &&
                addStudents.map((student) => (
                  <StudentListItems
                    key={student.partyId}
                    student={student}
                    onRemove={removeEnrolledSibling}
                    undoIcon
                  >
                    <Typography
                      component="h4"
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {displayName(student)}
                      <Chip
                        label="Add"
                        size="small"
                        variant="soft"
                        color="green"
                        sx={{ mx: 2 }}
                      />
                    </Typography>
                  </StudentListItems>
                ))}
            </StudentListContainer>
            <StudentListContainer>
              {currentStudents &&
                currentStudents.map((student) => (
                  <StudentListItems
                    key={student.partyId}
                    student={student}
                    onRemove={removeEnrolledSibling}
                    undoIcon={false}
                  >
                    <Typography
                      component="h4"
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {displayName(student)}
                    </Typography>
                  </StudentListItems>
                ))}
            </StudentListContainer>
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
