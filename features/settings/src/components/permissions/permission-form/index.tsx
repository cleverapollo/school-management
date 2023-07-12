import { Grid, Tab, Card, CardHeader, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { Feature, MemberType, SavePermissionGroupSet } from '@tyro/api';
import { ConfirmDialog, useDisclosure, useFormValidator } from '@tyro/core';
import { useNavigate } from 'react-router-dom';
import { GeneralInformation } from './general-information';
import { SelectPermissions } from './select-permissions';
import { AssignMembers } from './assign-members';
import { PermissionFormState } from './types';
import { useSavePermissionGroup } from '../../../api/permissions/save-permissions';

enum TabOption {
  PERMISSIONS = 'permissions',
  MEMBERS = 'members',
}

type PermissionFormProps = {
  initialState?: Partial<PermissionFormState>;
};

const defaultFormStateValues: Partial<PermissionFormState> = {
  members: [],
  memberType: MemberType.Staff,
};

export const PermissionForm = ({ initialState }: PermissionFormProps) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const navigate = useNavigate();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { mutate: savePermissionGroupMutation, isLoading } =
    useSavePermissionGroup();

  const [tab, setTab] = useState<TabOption>(TabOption.PERMISSIONS);

  const { rules, resolver } = useFormValidator<PermissionFormState>();

  const {
    control,
    watch,
    handleSubmit,
    setFocus,
    setValue,
    register,
    reset,
    formState: { isDirty },
  } = useForm<PermissionFormState>({
    defaultValues: defaultFormStateValues,
    resolver: resolver({
      name: rules.required(),
      description: rules.required(),
      memberType: rules.required(),
    }),
  });

  const [memberType, members] = watch(['memberType', 'members']);

  const goBack = () => {
    navigate('/settings/permissions');
  };

  const handleCancelForm = () => {
    if (isDirty) {
      onOpenCancelModal();
    } else {
      goBack();
    }
  };

  useEffect(() => {
    if (initialState) {
      reset({ ...defaultFormStateValues, ...initialState });
    }
  }, [initialState]);

  useEffect(() => {
    reset({ ...defaultFormStateValues, ...initialState, memberType });
  }, [memberType]);

  const onSubmit = handleSubmit(
    ({
      id,
      name,
      description,
      memberType: memberTypeValue,
      members: memberParties,
      permissionSets,
    }) => {
      const locale = i18n.language;

      savePermissionGroupMutation(
        {
          id,
          name: [
            {
              value: name,
              locale,
            },
          ],
          description: [
            {
              value: description,
              locale,
            },
          ],
          memberType: memberTypeValue,
          memberPartyIds: memberParties.map(
            (memberParty) => memberParty.partyId
          ),
          permissionSets: Object.keys(permissionSets).reduce(
            (permissions, featureKey) => [
              ...permissions,
              ...permissionSets[featureKey as Feature].filter(
                (permission) =>
                  permission.permissionType ||
                  typeof permission.toggle === 'boolean'
              ),
            ],
            [] as SavePermissionGroupSet[]
          ),
        },
        {
          onSuccess: goBack,
        }
      );
    }
  );

  return (
    <Grid container gap={3} component="form" onSubmit={onSubmit}>
      <Grid item xs={12} lg={10}>
        <GeneralInformation control={control} />
      </Grid>
      <Grid item xs={12} lg={10}>
        <Card variant="outlined">
          <TabContext value={tab} key={memberType}>
            <CardHeader
              sx={{ pt: 1, pb: 0 }}
              title={
                <TabList onChange={(_, value: TabOption) => setTab(value)}>
                  <Tab
                    value={TabOption.PERMISSIONS}
                    label={t('settings:permissions.selectPermissions')}
                  />
                  <Tab
                    value={TabOption.MEMBERS}
                    label={t('settings:permissions.assignMembers')}
                  />
                </TabList>
              }
            />
            <TabPanel value={TabOption.PERMISSIONS}>
              <SelectPermissions
                register={register}
                setValue={setValue}
                control={control}
                memberType={memberType}
              />
            </TabPanel>
            <TabPanel value={TabOption.MEMBERS}>
              <AssignMembers
                control={control}
                memberType={memberType}
                members={members}
                setFocus={setFocus}
                setValue={setValue}
              />
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
      <Grid item xs={12} lg={10} pb={2} position="sticky" bottom={0}>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button
            variant="soft"
            size="large"
            color="primary"
            onClick={handleCancelForm}
            disabled={isLoading}
          >
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            size="large"
            type="submit"
          >
            {t('settings:permissions.savePermissionsGroup')}
          </LoadingButton>
        </Stack>
      </Grid>
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={onCloseCancelModal}
        onConfirm={goBack}
      />
    </Grid>
  );
};
