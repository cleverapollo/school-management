import { Box, Button, Fade, Slide, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from '@tyro/i18n';
import { SaveIcon, ThumbsUpCheckmarkIcon, UndoIcon } from '@tyro/icons';
import { EditState } from '../hooks/use-editable-state';

interface BulkEditSaveBarProps {
  isEditing: boolean;
  editingState: EditState;
  numberOfEdits: number;
  onSave: () => void;
  onCancel: () => void;
  additionalEditBarElements?: React.ReactNode;
}

export function BulkEditSaveBar({
  isEditing,
  editingState,
  numberOfEdits,
  onSave,
  onCancel,
  additionalEditBarElements,
}: BulkEditSaveBarProps) {
  const { t } = useTranslation(['common']);

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
    <Slide direction="up" in={isEditing} mountOnEnter unmountOnExit>
      <Box
        className="bulk-edit-save-bar"
        sx={({ zIndex }) => ({
          position: 'fixed',
          bottom: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'slate.100',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          width: '100%',
          zIndex: zIndex.drawer + 1,
          py: 1.25,
          px: 2.25,
          borderTop: '1px solid',
          borderTopColor: 'indigo.50',
          boxShadow: '0px -1px 10px rgba(99, 102, 241, 0.20)',
        })}
      >
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'indigo.50',
            borderRadius: 1.5,
            flex: {
              xs: 1,
              sm: 'inherit',
            },
          }}
          spacing={6}
        >
          {additionalEditBarElements && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                pl: 3.25,
              }}
            >
              {additionalEditBarElements}
            </Box>
          )}
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            px={3.25}
            py={2}
          >
            <Fade
              in={
                editingState !== EditState.Saved &&
                editingState !== EditState.Saving
              }
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle2" component="span">
                  {t('common:unsavedChanges', {
                    count: numberOfEdits,
                    defaultValue: '0',
                  })}
                </Typography>
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
        </Stack>
      </Box>
    </Slide>
  );
}
