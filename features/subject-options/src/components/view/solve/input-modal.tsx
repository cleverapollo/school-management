import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LoadingPlaceholderContainer,
  CopyClipboardButton,
} from '@tyro/core';
import { Box, Button, Card } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useOptionsSolverInput } from '../../../api/solver-input';

interface SolverInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionId: number;
}

export function SolverInputModal({
  isOpen,
  onClose,
  optionId,
}: SolverInputModalProps) {
  const { t } = useTranslation(['subjectOptions', 'common']);
  const { data: input, isLoading } = useOptionsSolverInput(
    { optionId },
    isOpen
  );

  const formattedInput = JSON.stringify(JSON.parse(input ?? '{}'), null, 2);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {t('subjectOptions:solverInput')}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', position: 'relative' }}>
        {!isLoading && (
          <CopyClipboardButton
            textToCopy={formattedInput}
            buttonLabel={t('common:actions.copy')}
            sx={{
              position: 'absolute',
              right: 32,
              top: 8,
              zIndex: 1,
            }}
          />
        )}
        <Box
          sx={{
            backgroundColor: 'slate.50',
            borderRadius: 2,
            px: 1,
            py: 0.25,
            minHeight: 200,
            flex: 1,
            overflow: 'auto',
          }}
        >
          <LoadingPlaceholderContainer isLoading={isLoading}>
            <pre>{formattedInput}</pre>
          </LoadingPlaceholderContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="soft" onClick={onClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
