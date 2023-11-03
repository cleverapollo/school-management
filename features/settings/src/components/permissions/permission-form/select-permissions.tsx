import { Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Control, UseFormSetValue } from 'react-hook-form';
import { InfoCircleIcon } from '@tyro/icons';
import { RHFSwitch, RHFTextField, VisuallyHidden } from '@tyro/core';
import { useEffect, useMemo } from 'react';
import {
  Feature,
  MemberType,
  PermissionSet,
  PermissionSetFilter,
} from '@tyro/api';
import { PermissionAccordionCard } from './permission-accordion-card';
import { usePermissionSets } from '../../../api/permissions/user-permissions-sets';
import { PermissionFormState } from './types';
import { PermissionTypeDropdown } from './permission-type-dropdown';

type SelectPermissionsProps = {
  control: Control<PermissionFormState>;
  setValue: UseFormSetValue<PermissionFormState>;
  memberType: MemberType;
  isMemberTypeDirty: boolean;
};

const filters: Record<MemberType, PermissionSetFilter> = {
  [MemberType.Admin]: {
    staff: true,
  },
  [MemberType.Staff]: {
    staff: true,
  },
  [MemberType.Contact]: {
    contact: true,
  },
  [MemberType.Student]: {
    student: true,
  },
  [MemberType.External]: {},
  [MemberType.ThirdParty]: {},
};

type PermissionsByFeatures = Array<{
  feature: Feature;
  permissions: Array<
    Pick<
      PermissionSet,
      'id' | 'name' | 'description' | 'feature' | 'toggle' | 'permissionType'
    >
  >;
}>;

export const SelectPermissions = ({
  isMemberTypeDirty,
  memberType,
  control,
  setValue,
}: SelectPermissionsProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const { data: permissionData = [] } = usePermissionSets(filters[memberType]);

  const permissionsByFeatures = useMemo(() => {
    const availableFeatures = Array.from(
      new Set([
        ...permissionData.flatMap<Feature>((permission) =>
          permission ? [permission.feature!] : []
        ),
      ])
    );

    return availableFeatures.reduce<PermissionsByFeatures>(
      (permissionsFieldsByFeature, feature) => {
        permissionsFieldsByFeature.push({
          feature,
          permissions: permissionData.filter(
            (permission) => permission.feature === feature
          ),
        });

        return permissionsFieldsByFeature;
      },
      []
    );
  }, [permissionData]);

  useEffect(() => {
    if (isMemberTypeDirty) {
      setValue('permissionsFieldsBySetId', {});

      permissionsByFeatures.forEach(({ permissions }) => {
        permissions.forEach((permission) => {
          setValue(`permissionsFieldsBySetId.${permission.id}`, permission);
        });
      });
    }
  }, [memberType, permissionsByFeatures]);

  return (
    <Grid container gap={3}>
      {permissionsByFeatures.map((field) => (
        <PermissionAccordionCard
          key={`${memberType}-${field.feature}`}
          feature={field.feature}
          control={control}
          totalPermissions={field.permissions.length}
        >
          <Stack gap={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="600"
              textTransform="uppercase"
            >
              {t('settings:permissions.permissionSet')}
            </Typography>
            {field.permissions.map((permission) => (
              <Paper
                variant="elevation"
                key={permission.id}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: 'background.neutral',
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
                    <Typography variant="body2">
                      {permission.name}

                      <Tooltip
                        title={permission.description}
                        placement="top"
                        arrow
                      >
                        <InfoCircleIcon
                          sx={{
                            width: 18,
                            height: 18,
                            ml: 0.5,
                            verticalAlign: 'middle',
                          }}
                        />
                      </Tooltip>
                    </Typography>
                  </Stack>
                  <VisuallyHidden>
                    <RHFTextField
                      textFieldProps={{ type: 'hidden' }}
                      controlProps={{
                        name: `permissionsFieldsBySetId.${permission.id}.id`,
                        control,
                        defaultValue: permission.id,
                      }}
                    />
                    <RHFTextField
                      textFieldProps={{ type: 'hidden' }}
                      controlProps={{
                        name: `permissionsFieldsBySetId.${permission.id}.feature`,
                        control,
                        defaultValue: permission.feature,
                      }}
                    />
                  </VisuallyHidden>
                  {typeof permission.toggle === 'boolean' ? (
                    <RHFSwitch
                      label={t('common:enabled')}
                      switchProps={{
                        color: 'success',
                      }}
                      controlProps={{
                        name: `permissionsFieldsBySetId.${permission.id}.toggle`,
                        control,
                      }}
                    />
                  ) : (
                    <PermissionTypeDropdown
                      name={`permissionsFieldsBySetId.${permission.id}.permissionType`}
                      control={control}
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
