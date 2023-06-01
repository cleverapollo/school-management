import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeOfUseListManagerState } from '../state';

interface StudentEditsModalProps {
  open: boolean;
  editedStudents: ReturnTypeOfUseListManagerState['editedState']['editedStudents'];
  onClose: () => void;
}

export function StudentEditsModal({
  open,
  editedStudents,
  onClose,
}: StudentEditsModalProps) {
  const { t } = useTranslation(['common']);
  const { displayName } = usePreferredNameLayout();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Moved students</DialogTitle>
      <Stack sx={{ p: 3 }}>
        {editedStudents.map(({ student, sourceGroup, destinationGroup }) => {
          const name = displayName(student?.person);
          return (
            <Stack
              direction="row"
              key={student.id}
              spacing={1}
              alignItems="center"
            >
              <Avatar
                name={name}
                src={student?.person?.avatarUrl}
                sx={{
                  my: 1,
                  mr: 1,
                }}
              />
              <Stack>
                <Typography variant="body2" color="text.primary">
                  {name}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
