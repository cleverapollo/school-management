import { Grid, Typography } from '@mui/material';
import { RHFDatePicker, RHFSwitch, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import { UpsertStaffInput } from '@tyro/api';
import dayjs from 'dayjs';
import { EmploymentCapacityAutocomplete } from '../../common/employment-capacity-autocomplete';
import { EmploymentCapacityOption } from '../../../api/staff/employment-capacities';

export type EmploymentInformationFormState = {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  position: UpsertStaffInput['position'];
  employmentCapacity: EmploymentCapacityOption;
  displayCode: UpsertStaffInput['displayCode'];
  availableForTeaching: UpsertStaffInput['availableForTeaching'];
  availableForSubstitution: UpsertStaffInput['availableForSubstitution'];
  availableForSupportClasses: UpsertStaffInput['availableForSupportClasses'];
};

type EmploymentInformationProps<TField extends EmploymentInformationFormState> =
  {
    control: TField extends EmploymentInformationFormState
      ? Control<TField>
      : never;
  };

export const EmploymentInformation = <
  TField extends EmploymentInformationFormState
>({
  control,
}: EmploymentInformationProps<TField>) => {
  const { t } = useTranslation(['people', 'common']);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="subtitle1" component="h3" color="text.secondary">
          {t('people:employmentInformation')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFDatePicker
          label={t('common:startDate')}
          inputProps={{ fullWidth: true }}
          controlProps={{ name: 'startDate', control }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:position')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{ name: 'position', control }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <EmploymentCapacityAutocomplete
          label={t('people:employmentCapacity')}
          controlProps={{
            name: 'employmentCapacity',
            control,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          label={t('people:displayCode')}
          textFieldProps={{ fullWidth: true }}
          controlProps={{ name: 'displayCode', control }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSwitch
          label={t('people:availableForTeaching')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'availableForTeaching', control }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSwitch
          label={t('people:availableForSubstitution')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'availableForSubstitution', control }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSwitch
          label={t('people:availableForSupportClasses')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'availableForSupportClasses', control }}
        />
      </Grid>
    </Grid>
  );
};
