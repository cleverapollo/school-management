import {
  Box,
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
  Typography,
} from '@mui/material';
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
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <PersonHeartIcon sx={{ mr: 1 }} />
        {t('people:condition')}
      </DialogTitle>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          padding: '16px',
          backgroundColor: 'slate.50',
        }}
      >
        <Stack sx={{ px: 1, py: 1 }}>
          <Typography variant="h6" component="h3">
            {t('common:name')}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {initialConditionsState?.name}
          </Typography>
        </Stack>

        <Stack sx={{ px: 1, py: 1 }}>
          <Typography variant="h6" component="h3">
            {t('common:description')}
          </Typography>
          <Typography variant="body1">
            {initialConditionsState?.description}
          </Typography>
        </Stack>

        <Stack
          sx={{
            display: 'flex',
            flexDirection: ['column', 'row'],
            gap: 2,
            '& > *': {
              flex: '1 1 50%',
            },
          }}
        >
          <Stack>
            <Typography variant="h6" component="h3">
              {t('people:equipment')}
            </Typography>
            <Typography variant="body1">
              {initialConditionsState?.equipment &&
                initialConditionsState?.equipment[0].location}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6" component="h3">
              {t('people:locationOfEquipment')}
            </Typography>
            <Typography variant="body1">
              {initialConditionsState?.equipment &&
                initialConditionsState?.equipment[0].location}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
