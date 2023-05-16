import { Stack, Typography } from '@mui/material';
import { RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import { InputAddress } from '@tyro/api';

export type PrimaryAddressFormState = {
  addressLine1: InputAddress['line1'];
  addressLine2: InputAddress['line2'];
  addressLine3: InputAddress['line3'];
  county: InputAddress['city'];
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
    <>
      <Typography
        variant="body1"
        component="h3"
        color="text.secondary"
        fontWeight={600}
      >
        {t('people:contactForm.primaryAddress')}
      </Typography>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:contactForm.labels.addressLine1')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'addressLine1',
            control,
          }}
        />
        <RHFTextField
          label={t('people:contactForm.labels.addressLine2')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'addressLine2',
            control,
          }}
        />
      </Stack>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:contactForm.labels.addressLine3')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'addressLine3',
            control,
          }}
        />
        <RHFTextField
          label={t('people:contactForm.labels.county')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'county',
            control,
          }}
        />
      </Stack>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:contactForm.labels.eircode')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'eircode',
            control,
          }}
        />
        <RHFTextField
          label={t('people:contactForm.labels.country')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'country',
            control,
          }}
        />
      </Stack>
    </>
  );
};
