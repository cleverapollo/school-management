import { Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { Avatar, usePreferredNameLayout, useDisclosure } from '@tyro/core';
import { ChevronDownIcon } from '@tyro/icons';
import { useRef } from 'react';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseAssessmentById } from '../../api/assessments';
import { ReturnTypeFromUseOverallCommentsByYearGroup } from '../../api/overall-comment-year-group';
import { CommentStatusIcon } from './comment-status-icon';

interface StudentDropdownForOverallCommentsProps {
  yearGroupEnrollment:
    | NonNullable<
        ReturnTypeFromUseAssessmentById['yearGroupEnrolments']
      >[number]
    | undefined;
  students: ReturnTypeFromUseOverallCommentsByYearGroup[];
  selectedStudent: ReturnTypeFromUseOverallCommentsByYearGroup;
  onSelectStudent: (
    student: ReturnTypeFromUseOverallCommentsByYearGroup | null
  ) => void;
}

export function StudentDropdownForOverallComments({
  yearGroupEnrollment,
  students,
  selectedStudent,
  onSelectStudent,
}: StudentDropdownForOverallCommentsProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { displayName } = usePreferredNameLayout();
  const { t } = useTranslation(['assessments']);
  const { id, isOpen, onOpen, onClose } = useDisclosure();
  const selectedStudentName = displayName(selectedStudent?.student?.person);

  return (
    <>
      <Button
        ref={buttonRef}
        id={id}
        variant="soft"
        aria-haspopup="listbox"
        aria-expanded={isOpen ? 'true' : undefined}
        startIcon={
          <Avatar
            name={selectedStudentName}
            src={selectedStudent?.student?.person?.avatarUrl}
            size={24}
          />
        }
        sx={{
          '& .MuiButton-startIcon .MuiAvatar-root': {
            fontSize: Math.ceil(24 * 0.35),
          },
        }}
        onClick={onOpen}
        endIcon={<ChevronDownIcon />}
      >
        {selectedStudentName}
      </Button>
      <Menu
        anchorEl={buttonRef.current}
        open={isOpen}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': id,
          role: 'listbox',
        }}
      >
        {students?.map((student) => {
          const name = displayName(student.student.person);
          return (
            <MenuItem
              key={student.studentPartyId}
              selected={
                selectedStudent.studentPartyId === student.studentPartyId
              }
              onClick={() => {
                onSelectStudent(student);
                onClose();
              }}
              sx={{
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar name={name} src={student.student.person.avatarUrl} />
                <Stack justifyContent="flex-start" textAlign="left">
                  <Typography variant="subtitle2">{name}</Typography>
                  <Typography variant="body2">
                    {t(`assessments:commentStatus.${student.commentStatus}`)}
                  </Typography>
                </Stack>
              </Stack>
              <CommentStatusIcon commentStatus={student.commentStatus} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
