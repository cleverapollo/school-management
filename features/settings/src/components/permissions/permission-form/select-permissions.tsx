import { Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { InfoCircleIcon } from '@tyro/icons';
import {
  Feature,
  MemberType,
  PermissionSet,
  PermissionSetFilter,
} from '@tyro/api';
import { RHFSwitch } from '@tyro/core';
import { useMemo } from 'react';
import { PermissionAccordionCard } from './permission-accordion-card';
import { PermissionTypeDropdown } from './permission-type-dropdown';
import { usePermissionSets } from '../../../api/permissions/user-permissions-sets';
import { PermissionFormState } from './types';

type SelectPermissionsProps = {
  memberType: MemberType;
  control: Control<PermissionFormState>;
  setValue: UseFormSetValue<PermissionFormState>;
  register: UseFormRegister<PermissionFormState>;
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
};

type PermissionByFeature = Record<Feature, Array<Partial<PermissionSet>>>;

export const SelectPermissions = ({
  memberType,
  control,
  setValue,
  register,
}: SelectPermissionsProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const { data: permissionData = [] } = usePermissionSets(filters[memberType]);

  const permissionsByFeature = useMemo<PermissionByFeature>(
    () =>
      permissionData.reduce((acc, permissionSet) => {
        if (!permissionSet?.feature) return acc;

        acc[permissionSet.feature] ??= [];
        acc[permissionSet.feature].push(permissionSet);

        return acc;
      }, {} as PermissionByFeature),
    [permissionData]
  );

  return (
    <Grid container gap={3}>
      {Object.keys(permissionsByFeature).map((featureKey) => {
        const featureKeyAsEnum = featureKey as Feature;
        const permissions = permissionsByFeature[featureKeyAsEnum];

        return (
          <PermissionAccordionCard
            key={`${memberType}-${featureKey}`}
            feature={featureKeyAsEnum}
            totalPermissions={permissions.length}
            control={control}
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
              {permissions.map((permission, permissionIndex) => (
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
                    <input
                      type="hidden"
                      {...register(
                        `permissionSets.${featureKeyAsEnum}.${permissionIndex}.id`
                      )}
                      value={permission.id}
                    />
                    {permission.toggle ? (
                      <RHFSwitch
                        label={t('common:enabled')}
                        switchProps={{
                          color: 'success',
                        }}
                        controlProps={{
                          name: `permissionSets.${featureKeyAsEnum}.${permissionIndex}.toggle`,
                          control,
                        }}
                      />
                    ) : (
                      <PermissionTypeDropdown
                        control={control}
                        setValue={setValue}
                        name={`permissionSets.${featureKeyAsEnum}.${permissionIndex}.permissionType`}
                      />
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </PermissionAccordionCard>
        );
      })}
    </Grid>
  );
};
