import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  LoadingPlaceholder,
  usePreferredNameLayout,
} from '@tyro/core';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useStudent } from '../../../../api/student/students';
import { useNotes } from '../../../../api/note/list';
import { StudentAvatarPicture } from '../student-avatar-picture';
import { BottomGradientLink } from './bottom-gradient-link';
import { KTKNote, NTKNoteContainer } from './notes';

interface NeedToKnowModalProps {
  id: string;
  studentPartyId: number;
  open: boolean;
  onClose: () => void;
}

export function NeedToKnowModal({
  id,
  studentPartyId,
  open,
  onClose,
}: NeedToKnowModalProps) {
  const { displayName } = usePreferredNameLayout();

  const { data: student, isLoading: isStudentLoading } = useStudent(
    studentPartyId,
    open
  );
  const { data: priorityNotes, isLoading: isNotesLoading } = useNotes(
    {
      partyIds: [studentPartyId],
      priority: true,
    },
    open
  );

  const name = displayName(student?.person);
  const isLoading = isStudentLoading || isNotesLoading;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      {isLoading ? (
        <LoadingPlaceholder sx={{ height: '100vh', maxHeight: 320 }} />
      ) : (
        <DialogContent
          sx={{
            p: 2,
            pb: 13,
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <StudentAvatarPicture
                name={name}
                src={student?.person?.avatarUrl}
                isPriorityStudent={!!student?.extensions?.priority}
                hasSupportPlan={false}
                size={68}
              />
              <Stack>
                <Typography component="h2" variant="h4">
                  {name}
                </Typography>
                <Typography variant="body1">
                  {student?.classGroup?.name}
                </Typography>
              </Stack>
            </Stack>
            <DialogCloseButton
              onClick={onClose}
              sx={{ mt: '6px !important' }}
            />
          </Stack>
          <NTKNoteContainer>
            {priorityNotes?.map((note) => (
              <KTKNote key={note.id} note={note} />
            ))}
          </NTKNoteContainer>
          <BottomGradientLink {...student?.person} onClose={onClose} />
        </DialogContent>
      )}
    </Dialog>
  );
}
