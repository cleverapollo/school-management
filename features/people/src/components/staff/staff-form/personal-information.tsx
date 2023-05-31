import { Grid, Typography } from '@mui/material';
import { RHFTextField, RHFSelect } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import {
  InputEmailAddress,
  CreateStaffInput,
  Gender,
  PersonalTitle,
} from '@tyro/api';
import { MobileNumber, MobileNumberData } from '../../common/mobile-number';
import { PersonalTitlesDropdown } from '../../common/personal-titles-dropdown';

export type PersonalInformationFormState = {
  title: PersonalTitle;
  firstName: CreateStaffInput['firstName'];
  lastName: CreateStaffInput['lastName'];
  gender: CreateStaffInput['gender'];
  mobileNumber: MobileNumberData | undefined;
  additionalNumber: string;
  email: InputEmailAddress['email'];
};

const genderOptions = Object.values(Gender);

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
        <Typography variant="subtitle1" component="h3" color="text.secondary">
          {t('common:details')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <PersonalTitlesDropdown
          label={t('people:title')}
          controlProps={{
            name: 'title',
            control,
          }}
        />
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
            name: 'lastName',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSelect<PersonalInformationFormState, Gender>
          fullWidth
          label={t('people:gender.title')}
          options={genderOptions}
          getOptionLabel={(option) => t(`people:gender.${option}`)}
          controlProps={{
            name: 'gender',
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
            defaultValue: '(+52) 8443561465',
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('common:additionalNumber')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'additionalNumber',
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
    </Grid>
  );
};
