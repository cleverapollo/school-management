import { Grid, Typography } from '@mui/material';
import { RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

export type NextOfKinFormState = {
  nextOfKinFirstName: string;
  nextOfKinSurname: string;
  nextOfKinPhoneNumber: string;
  nextOfKinAdditionalNumber: string;
};

type NextOfKinProps<TField extends NextOfKinFormState> = {
  control: TField extends NextOfKinFormState ? Control<TField> : never;
};

export const NextOfKin = <TField extends NextOfKinFormState>({
  control,
}: NextOfKinProps<TField>) => {
  const { t } = useTranslation(['people', 'common']);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" component="h3" color="text.secondary">
          {t('people:nextOfKin')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.forename')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'nextOfKinFirstName',
            control,
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.surname')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'nextOfKinSurname',
            control,
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('common:phoneNumber')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'nextOfKinPhoneNumber',
            control,
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('common:additionalNumber')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'nextOfKinAdditionalNumber',
            control,
          }}
        />
      </Grid>
    </Grid>
  );
};
