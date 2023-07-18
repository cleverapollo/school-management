import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
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
          mb: 3,
        }}
      >
        <PersonHeartIcon sx={{ mr: 1 }} />
        {t('people:condition')}
      </DialogTitle>
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ backgroundColor: 'slate.50', pb: 3, px: 3 }}
      >
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">
            {t('common:name')}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {initialConditionsState?.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">
            {t('common:description')}
          </Typography>
          <Typography variant="body1">
            {initialConditionsState?.description}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Typography variant="h6" component="h3">
            {t('people:equipment')}
          </Typography>
          <Typography variant="body1">
            {initialConditionsState?.equipment &&
              initialConditionsState?.equipment[0].location}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Typography variant="h6" component="h3">
            {t('people:locationOfEquipment')}
          </Typography>
          <Typography variant="body1">
            {initialConditionsState?.equipment &&
              initialConditionsState?.equipment[0].location}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DialogActions sx={{ px: 3, py: 3, backgroundColor: 'white' }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.close')}
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  );
};
