import { Stack, Typography } from '@mui/material';
import { RHFSwitch, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import {
  InputEmailAddress,
  InputPhoneNumber,
  PersonalInformation as PersonalInformationType,
} from '@tyro/api';

export type PersonalInformationFormState = {
  firstName: PersonalInformationType['firstName'];
  surname: PersonalInformationType['lastName'];
  mobileNumber: InputPhoneNumber['number'];
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
  const { t } = useTranslation(['people']);

  return (
    <>
      <Typography
        variant="body1"
        component="h3"
        color="text.secondary"
        fontWeight={600}
      >
        {t('people:contactForm.personalInformation')}
      </Typography>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:contactForm.labels.firstName')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'firstName',
            control,
          }}
        />
        <RHFTextField
          label={t('people:contactForm.labels.surname')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'surname',
            control,
          }}
        />
      </Stack>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:contactForm.labels.mobileNumber')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'mobileNumber',
            control,
          }}
        />
        <RHFTextField
          label={t('people:contactForm.labels.email')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'email',
            control,
          }}
        />
      </Stack>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:contactForm.labels.spokenLanguage')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'spokenLanguage',
            control,
          }}
        />
        <RHFSwitch
          label={t('people:contactForm.labels.requiresInterpreter')}
          controlLabelProps={{ sx: { width: '100%' } }}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'requiresInterpreter', control }}
        />
      </Stack>
    </>
  );
};
