import { Box, Button, Stack, Typography } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { PersonHeartIcon } from '@tyro/icons';
import { UpsertStudentMedicalConditionInput } from '@tyro/api';

export type ViewConditionsState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment' | 'studentPartyId'
>;

export type ViewConditionsProps = {
  initialConditionsState?: Partial<ViewConditionsState> | null;
  onClose: () => void;
};

export const ViewConditionsModal = ({
  initialConditionsState,
  onClose,
}: ViewConditionsProps) => {
  const { t } = useTranslation(['people', 'common']);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={!!initialConditionsState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 3,
        }}
      >
        <PersonHeartIcon sx={{ mr: 1 }} />
        {t('people:condition')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" component="h3">
              {t('common:name')}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {initialConditionsState?.name}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" component="h3">
              {t('common:description')}
            </Typography>
            <Typography variant="body1">
              {initialConditionsState?.description}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box flexGrow={1}>
              <Typography variant="h6" component="h3">
                {t('people:equipment')}
              </Typography>
              <Typography variant="body1">
                {initialConditionsState?.equipment &&
                  initialConditionsState?.equipment[0].location}
              </Typography>
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h6" component="h3">
                {t('people:locationOfEquipment')}
              </Typography>
              <Typography variant="body1">
                {initialConditionsState?.equipment &&
                  initialConditionsState?.equipment[0].location}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
