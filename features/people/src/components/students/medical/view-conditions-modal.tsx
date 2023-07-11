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
import { ReturnTypeFromUseStudentMedical } from './conditions-table';

export type ViewConditionsState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment' | 'studentPartyId'
>;

export type ViewConditionsProps = {
  studentId: number | undefined;
  initialConditionsState?: Partial<ViewConditionsState> | null;
  conditions: ReturnTypeFromUseStudentMedical[];
  onClose: () => void;
};

export const ViewConditionsModal = ({
  studentId,
  initialConditionsState,
  conditions,
  onClose,
}: ViewConditionsProps) => {
  const { t } = useTranslation(['settings', 'people', 'common']);

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
          <Typography variant="h6">{t('common:name')}</Typography>
          <Typography variant="body1" color="text.primary">
            {initialConditionsState?.name}
          </Typography>
        </Stack>

        <Stack sx={{ px: 1, py: 1 }}>
          <Typography variant="h6">{t('common:description')}</Typography>
          <Typography variant="body1">
            {initialConditionsState?.description}
          </Typography>
        </Stack>

        <Stack
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: '1fr',
            px: 1,
            py: 1,
          }}
        >
          <Stack>
            <Typography variant="h6">{t('people:equipment')}</Typography>
            <Typography variant="body1">
              {initialConditionsState?.equipment &&
                initialConditionsState?.equipment[0].location}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">
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
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => handleClose()}
        >
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
