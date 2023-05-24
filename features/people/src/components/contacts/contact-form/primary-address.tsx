import { Grid, Typography } from '@mui/material';
import { RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import { InputAddress } from '@tyro/api';

export type PrimaryAddressFormState = {
  addressLine1: InputAddress['line1'];
  addressLine2: InputAddress['line2'];
  addressLine3: InputAddress['line3'];
  city: InputAddress['city'];
  country: InputAddress['country'];
  eircode: InputAddress['postCode'];
};

type PrimaryAddressProps<TField extends PrimaryAddressFormState> = {
  control: TField extends PrimaryAddressFormState ? Control<TField> : never;
};

export const PrimaryAddress = <TField extends PrimaryAddressFormState>({
  control,
}: PrimaryAddressProps<TField>) => {
  const { t } = useTranslation(['people']);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="text.secondary">
          {t('people:primaryAddress')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.addressLine1')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'addressLine1',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.addressLine2')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'addressLine2',
            control,
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.addressLine3')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'addressLine3',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.city')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'city',
            control,
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.eircode')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'eircode',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.country')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'country',
            control,
          }}
        />
      </Grid>
    </Grid>
  );
};
