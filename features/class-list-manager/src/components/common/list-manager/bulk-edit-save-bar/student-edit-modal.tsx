import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { UndoIcon } from '@tyro/icons';
import { useListManagerState } from '../state';
import { EditedStudent } from '../state/edited-state';

interface StudentEditsModalProps {
  open: boolean;
  onClose: () => void;
}

function getChangeStatus(
  editedStudent: EditedStudent,
  t: TFunction<
    ('common' | 'classListManager')[],
    undefined,
    ('common' | 'classListManager')[]
  >
) {
  const { sourceGroup, destinationGroup } = editedStudent;

  if (sourceGroup && destinationGroup) {
    return `${sourceGroup.name} → ${destinationGroup.name}`;
  }

  if (sourceGroup) {
    return t('classListManager:duplicateRemovedFromGroup', {
      group: sourceGroup.name,
    });
  }

  if (destinationGroup) {
    return t('classListManager:duplicateAddedToGroup', {
      group: destinationGroup.name,
    });
  }

  return '';
}

export function StudentEditsModal({ open, onClose }: StudentEditsModalProps) {
  const { t } = useTranslation(['common', 'classListManager']);
  const { displayName } = usePreferredNameLayout();
  const {
    editedState: { editedStudents, revertChange },
  } = useListManagerState();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle onClose={onClose}>{t('common:changes')}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Stack
          component="ul"
          sx={{
            m: 0,
            px: 1,
            '@media (hover: hover) and (pointer: fine)': {
              '& li button': {
                opacity: 0,
              },

              '& li:focus-within, & li:hover': {
                bgcolor: 'primary.lighter',

                '& button': {
                  opacity: 1,
                },
              },
            },
          }}
        >
          {editedStudents.map((editedStudent) => {
            const { student } = editedStudent;
            const name = displayName(student?.person);

            return (
              <Stack
                component="li"
                direction="row"
                key={student.id}
                spacing={1}
                alignItems="center"
                sx={{
                  px: 2,
                  borderRadius: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    name={name}
                    src={student?.person?.avatarUrl}
                    sx={{
                      my: 1,
                      mr: 1,
                    }}
                  />
                  <Stack>
                    <Typography variant="subtitle2" color="text.primary">
                      {name}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {getChangeStatus(editedStudent, t)}
                    </Typography>
                  </Stack>
                </Box>
                <Tooltip title={t('common:actions.undo')}>
                  <IconButton
                    aria-label={t('common:actions.undo')}
                    onClick={() => revertChange(editedStudent)}
                    color="primary"
                  >
                    <UndoIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          })}
        </Stack>
        {editedStudents.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 2,
              border: '1px solid transparent',
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              {t('common:noChangesMade')}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
