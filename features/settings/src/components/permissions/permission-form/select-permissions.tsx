import { Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';
import { InfoCircleIcon } from '@tyro/icons';
import { PermissionSet, PermissionType } from '@tyro/api';
import { RHFSwitch } from '@tyro/core';
import { useEffect } from 'react';
import { PermissionAccordionCard } from './permission-accordion-card';
import { PermissionTypeDropdown } from './permission-type-dropdown';
import { usePermissionSets } from '../../../api/permissions/user-permissions-sets';

// TODO: Check with BE payload needed to be sent
type UpdatedPermission = {
  id: PermissionSet['id'];
  name: PermissionSet['name'];
  description: PermissionSet['description'];
  permissions: Array<{
    id: string;
    name: PermissionSet['name'];
    description: PermissionSet['description'];
    toggle?: PermissionSet['toggle'];
    permissionType?: PermissionSet['permissionType'];
  }>;
};

export type SelectPermissionsFormState = {
  permissionSets: Array<UpdatedPermission>;
};

type SelectPermissionsProps<TField extends SelectPermissionsFormState> = {
  setValue: TField extends SelectPermissionsFormState
    ? UseFormSetValue<TField>
    : never;
  control: TField extends SelectPermissionsFormState ? Control<TField> : never;
};

const mockedPermissionsSets: UpdatedPermission[] = [
  {
    id: 1,
    name: 'Write attendance codes',
    description: 'Ability to create, edit and delete attendance codes',
    permissions: [
      {
        id: 'api:attendance:write:attendance_codes',
        name: 'Write Attendance Codes',
        description: 'Write Attendance Codes',
        toggle: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Administrate Calendars',
    description: 'Permissions to administrate all Calendars',
    permissions: [
      {
        id: 'api:core:read:room',
        name: 'Read Room Information',
        description: 'Read Room Information',
        permissionType: PermissionType.All,
      },
    ],
  },
];

export const SelectPermissions = <TField extends SelectPermissionsFormState>({
  setValue,
  control,
}: SelectPermissionsProps<TField>) => {
  const { t } = useTranslation(['settings', 'common']);
  const { data: permissionSetsData } = usePermissionSets({});

  useEffect(() => {
    if (permissionSetsData) {
      // TODO: remove casting when BE supports it.
      setValue('permissionSets', [
        ...mockedPermissionsSets,
        ...(permissionSetsData as unknown as UpdatedPermission[]),
      ]);
    }
  }, [permissionSetsData]);

  const { fields } = useFieldArray({ control, name: 'permissionSets' });

  return (
    <Grid container gap={3}>
      {fields.map((field, fieldIndex) => (
        <PermissionAccordionCard
          key={field.id}
          name={field.name}
          description={field.description}
          permissionsEnabled={10}
          totalPermissions={10}
        >
          <Stack gap={2}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="600"
              textTransform="uppercase"
            >
              {t('settings:permissions.permissionSet')}
            </Typography>
            {field.permissions.map((permission, permissionIndex) => (
              <Paper
                variant="elevation"
                key={permission.id}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: 'slate.50',
                }}
              >
                <Stack
                  direction="row"
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    width="100%"
                  >
                    <Typography variant="body2" noWrap>
                      {permission.name}
                    </Typography>
                    <Tooltip
                      title={permission.description}
                      placement="top"
                      arrow
                    >
                      <InfoCircleIcon sx={{ width: 18, height: 18 }} />
                    </Tooltip>
                  </Stack>
                  {typeof permission.toggle !== 'undefined' && (
                    <RHFSwitch
                      label={t('common:enabled')}
                      switchProps={{ color: 'success' }}
                      controlProps={{
                        name: `permissionSets.${fieldIndex}.permissions.${permissionIndex}.toggle`,
                        control,
                      }}
                    />
                  )}
                  {typeof permission.permissionType !== 'undefined' && (
                    <PermissionTypeDropdown
                      control={control}
                      name={`permissionSets.${fieldIndex}.permissions.${permissionIndex}.permissionType`}
                    />
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </PermissionAccordionCard>
      ))}
    </Grid>
  );
};
