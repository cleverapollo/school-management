import { useTranslation } from '@tyro/i18n';
import { RHFTextField } from '@tyro/core';
import { Card, Grid, CardHeader } from '@mui/material';
import { Control } from 'react-hook-form';
import { RHFStaffAutocomplete } from '@tyro/people';
import { CustomGroupFormState } from './types';

type GeneralInformationProps = {
  control: Control<CustomGroupFormState>;
};

export const GeneralInformation = ({ control }: GeneralInformationProps) => {
  const { t } = useTranslation(['common', 'groups']);

  return (
    <Card variant="outlined">
      <CardHeader component="h2" title={t('common:generalInformation')} />
      <Grid container spacing={3} p={3}>
        <Grid item xs={12} sm={6}>
          <RHFTextField
            label={t('groups:groupName')}
            textFieldProps={{
              fullWidth: true,
            }}
            controlProps={{
              name: 'name',
              control,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RHFStaffAutocomplete
            label={t('groups:organisers')}
            multiple
            controlProps={{
              name: 'organisers',
              control,
            }}
          />
        </Grid>
        {/* TODO: uncomment when description is not supported yet */}
        {/* <Grid item xs={12}>
          <RHFTextField
            label={t('groups:groupDescription')}
            textFieldProps={{
              fullWidth: true,
              multiline: true,
              minRows: 2,
            }}
            controlProps={{
              name: 'description',
              control,
            }}
          />
        </Grid> */}
      </Grid>
    </Card>
  );
};
