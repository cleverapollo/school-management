import { Grid, Typography } from '@mui/material';
import { RHFSelect, RHFDatePicker, RHFSwitch, RHFTextField } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';

import { CreateStaffInput, EmploymentCapacity } from '@tyro/api';
import dayjs from 'dayjs';

export type EmploymentInformationFormState = {
  employmentCapacity: CreateStaffInput['employmentCapacity'];
  isTeacher: CreateStaffInput['isTeacher'];
  displayCode: CreateStaffInput['displayCode'];
  includeInTimetabling: CreateStaffInput['includeInTimetabling'];
  startDate: dayjs.Dayjs;
};

const employmentCapacityOptions = Object.values(EmploymentCapacity);

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
    <Grid container spacing={2}>
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
        <RHFSelect<EmploymentInformationFormState, EmploymentCapacity>
          fullWidth
          label={t('people:employmentCapacity.title')}
          options={employmentCapacityOptions}
          getOptionLabel={(option) => t(`people:employmentCapacity.${option}`)}
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
          label={t('people:isATeacher')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'isTeacher', control }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSwitch
          label={t('people:includeInTimetabling')}
          switchProps={{ color: 'primary' }}
          controlProps={{ name: 'includeInTimetabling', control }}
        />
      </Grid>
    </Grid>
  );
};
