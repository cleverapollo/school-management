import { Button, Fade, Stack, Link } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { SaveBarButton, SaveBarContainer, useDisclosure } from '@tyro/core';
import { EditState } from '../state/edited-state';
import { StudentEditsModal } from './student-edit-modal';
import { useListManagerState } from '../state';

export function BulkEditSaveBar() {
  const { t } = useTranslation(['common']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    editedState: {
      isEditing,
      editingState,
      numberOfEdits,
      onSave,
      onCancel,
      ...modalProps
    },
  } = useListManagerState();

  return (
    <>
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
              <Link component="button" variant="subtitle2" onClick={onOpen}>
                {t('common:unsavedChanges', {
                  count: numberOfEdits,
                  defaultValue: '0',
                })}
              </Link>
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
      <StudentEditsModal open={isOpen} onClose={onClose} {...modalProps} />
    </>
  );
}
