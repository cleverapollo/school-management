import { Grid, Typography } from '@mui/material';
import { RHFCheckbox, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import {
  InputEmailAddress,
  PersonalInformation as PersonalInformationType,
} from '@tyro/api';
import { MobileNumber, MobileNumberData } from '../../common/mobile-number';

export type PersonalInformationFormState = {
  firstName: PersonalInformationType['firstName'];
  surname: PersonalInformationType['lastName'];
  mobileNumber: MobileNumberData | undefined;
  email: InputEmailAddress['email'];
  spokenLanguage: string;
  requiresInterpreter: boolean;
};

type PersonalInformationProps<TField extends PersonalInformationFormState> = {
  control: TField extends PersonalInformationFormState
    ? Control<TField>
    : never;
};

export const PersonalInformation = <
  TField extends PersonalInformationFormState
>({
  control,
}: PersonalInformationProps<TField>) => {
  const { t } = useTranslation(['people', 'common']);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="text.secondary">
          {t('common:details')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.forename')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'firstName',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.surname')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'surname',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MobileNumber
          label={t('common:mobileNumber')}
          controlProps={{
            name: 'mobileNumber',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('common:email')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'email',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:personal.about.spokenLanguage')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'spokenLanguage',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFCheckbox
          label={t('people:personal.about.requiresInterpreter')}
          controlLabelProps={{ sx: { width: '100%', ml: 0, height: '100%' } }}
          checkboxProps={{ color: 'primary' }}
          controlProps={{ name: 'requiresInterpreter', control }}
        />
      </Grid>
    </Grid>
  );
};
