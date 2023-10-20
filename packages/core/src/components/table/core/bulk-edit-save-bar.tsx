import { Box, Button, Fade, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { EditState, SaveBarButton, SaveBarContainer } from '../../save-bar';

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

  return (
    <SaveBarContainer
      slideProps={{ in: isEditing }}
      containerProps={{
        justifyContent: 'flex-end',
      }}
      contentProps={{
        flex: {
          xs: 1,
          sm: 'inherit',
        },
        spacing: 6,
      }}
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
            <Button variant="soft" color="primary" onClick={onCancel}>
              {t('common:actions.cancel')}
            </Button>
          </Stack>
        </Fade>

        <SaveBarButton
          editingState={editingState}
          onClick={editingState === EditState.Idle ? onSave : () => {}}
        />
      </Stack>
    </SaveBarContainer>
  );
}
