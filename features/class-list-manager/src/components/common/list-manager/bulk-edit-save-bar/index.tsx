import { Box, Button, Fade, Slide, Stack, Link } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from '@tyro/i18n';
import { SaveIcon, ThumbsUpCheckmarkIcon, UndoIcon } from '@tyro/icons';
import { useDisclosure } from '@tyro/core';
import { EditState } from '../state/edited-state';
import { ReturnTypeOfUseListManagerState } from '../state';
import { StudentEditsModal } from './student-edit-modal';

type BulkEditSaveBarProps = ReturnTypeOfUseListManagerState['editedState'];

export function BulkEditSaveBar({
  isEditing,
  editingState,
  numberOfEdits,
  onSave,
  onCancel,
  ...modalProps
}: BulkEditSaveBarProps) {
  const { t } = useTranslation(['common']);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getButtonLabel = () => {
    switch (editingState) {
      case EditState.Saving:
        return t('common:saving');
      case EditState.Saved:
        return t('common:saved');
      default:
        return t('common:actions.save');
    }
  };

  return (
    <>
      <Slide direction="up" in={isEditing} mountOnEnter unmountOnExit>
        <Box
          className="bulk-edit-save-bar"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            backgroundColor: 'background.paper',
            width: '100%',
          }}
        >
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            px={5}
            py={2}
          >
            <Fade
              in={
                editingState !== EditState.Saved &&
                editingState !== EditState.Saving
              }
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Link component="button" variant="subtitle2" onClick={onOpen}>
                  {t('common:unsavedChanges', {
                    count: numberOfEdits,
                    defaultValue: '0',
                  })}
                </Link>
                <Button
                  variant="soft"
                  color="primary"
                  endIcon={<UndoIcon />}
                  onClick={onCancel}
                >
                  {t('common:actions.cancel')}
                </Button>
              </Stack>
            </Fade>
            <LoadingButton
              variant={editingState === EditState.Saved ? 'soft' : 'contained'}
              color={editingState === EditState.Saved ? 'success' : 'primary'}
              loading={editingState === EditState.Saving}
              loadingPosition="end"
              endIcon={
                editingState === EditState.Saved ? (
                  <ThumbsUpCheckmarkIcon />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={editingState === EditState.Idle ? onSave : () => {}}
              sx={{
                transitionProperty: 'all',
                transitionTimingFunction: 'ease-in-out',
                transitionDuration: '150ms',
              }}
            >
              {getButtonLabel()}
            </LoadingButton>
          </Stack>
        </Box>
      </Slide>
      <StudentEditsModal open={isOpen} onClose={onClose} {...modalProps} />
    </>
  );
}
