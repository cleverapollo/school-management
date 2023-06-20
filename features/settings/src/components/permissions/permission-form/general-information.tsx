import { Card, CardHeader, Grid, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { MemberType, PermissionGroup } from '@tyro/api';
import { Control } from 'react-hook-form';
import { RHFSelect, RHFTextField } from '@tyro/core';

const memberTypeOptions = Object.values(MemberType);

export type GeneralInformationFormState = {
  name: PermissionGroup['name'];
  memberType: PermissionGroup['memberType'];
  description: PermissionGroup['description'];
};

type GeneralInformationProps<TField extends GeneralInformationFormState> = {
  control: TField extends GeneralInformationFormState ? Control<TField> : never;
};

export const GeneralInformation = <TField extends GeneralInformationFormState>({
  control,
}: GeneralInformationProps<TField>) => {
  const { t } = useTranslation(['settings', 'common']);

  return (
    <Card variant="outlined">
      <CardHeader
        component="h2"
        title={t('settings:permissions.permissionsGroups')}
      />
      <Grid container spacing={3} p={3}>
        <Grid item xs={12}>
          <Typography component="h3" variant="subtitle1" color="text.secondary">
            {t('settings:permissions.creatingNewGroup')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <RHFTextField
            label={t('common:name')}
            textFieldProps={{
              fullWidth: true,
              placeholder: t('settings:permissions.namePermissionsPlaceholder'),
            }}
            controlProps={{
              name: 'name',
              control,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RHFSelect
            fullWidth
            label={t('settings:permissions.memberType')}
            options={memberTypeOptions}
            getOptionLabel={(option) =>
              t(`settings:permissions.memberTypeOption.${option}`)
            }
            controlProps={{
              name: 'memberType',
              control,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField
            label={t('settings:permissions.groupDescription')}
            textFieldProps={{
              fullWidth: true,
              multiline: true,
              minRows: 2,
              placeholder: t(
                'settings:permissions.groupDescriptionPlaceholder'
              ),
            }}
            controlProps={{
              name: 'description',
              control,
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
