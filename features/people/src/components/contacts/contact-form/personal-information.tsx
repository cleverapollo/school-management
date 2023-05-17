import { Stack, Typography } from '@mui/material';
import { RHFSwitch, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import {
  InputEmailAddress,
  PersonalInformation as PersonalInformationType,
} from '@tyro/api';
import { MobileNumber, MobileNumberData } from './mobile-number';

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
    <>
      <Typography
        variant="body1"
        component="h3"
        color="text.secondary"
        fontWeight={600}
      >
        {t('people:personalInformation')}
      </Typography>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:personal.about.forename')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'firstName',
            control,
          }}
        />
        <RHFTextField
          label={t('people:personal.about.surname')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'surname',
            control,
          }}
        />
      </Stack>
      <Stack direction="row" gap={2}>
        <MobileNumber
          label={t('common:mobileNumber')}
          controlProps={{
            name: 'mobileNumber',
            control,
          }}
        />
        <RHFTextField
          label={t('common:email')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'email',
            control,
          }}
        />
      </Stack>
      <Stack direction="row" gap={2}>
        <RHFTextField
          label={t('people:personal.about.spokenLanguage')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{
            name: 'spokenLanguage',
            control,
          }}
        />
        <RHFSwitch
          label={t('people:personal.about.requiresInterpreter')}
          controlLabelProps={{ sx: { width: '100%' } }}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'requiresInterpreter', control }}
        />
      </Stack>
    </>
  );
};
