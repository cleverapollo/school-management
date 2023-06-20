import { Grid, Tab, Card, CardHeader, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { MemberType } from '@tyro/api';
import { ConfirmDialog, useDisclosure, useFormValidator } from '@tyro/core';
import { useNavigate } from 'react-router-dom';
import {
  GeneralInformation,
  GeneralInformationFormState,
} from './general-information';
import {
  SelectPermissions,
  SelectPermissionsFormState,
} from './select-permissions';
import { AssignMembers, AssignMembersFormState } from './assign-members';

type PermissionFormState = GeneralInformationFormState &
  SelectPermissionsFormState &
  AssignMembersFormState;

enum TabOption {
  PERMISSIONS = 'permissions',
  MEMBERS = 'members',
}

export const PermissionForm = () => {
  const { t } = useTranslation(['settings', 'common']);
  const navigate = useNavigate();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const [tab, setTab] = useState<TabOption>(TabOption.PERMISSIONS);

  const { rules, resolver } = useFormValidator<PermissionFormState>();

  const {
    control,
    watch,
    handleSubmit,
    setFocus,
    setValue,
    formState: { isDirty },
  } = useForm<PermissionFormState>({
    defaultValues: {
      memberType: MemberType.Staff,
      members: [],
    },
    resolver: resolver({
      name: rules.required(),
      description: rules.required(),
      memberType: rules.required(),
    }),
  });

  const [memberType, members] = watch(['memberType', 'members']);

  const onSubmit = (data: PermissionFormState) => {
    console.log(data);
  };

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
    setValue('members', []);
  }, [setValue, memberType]);

  return (
    <Grid container gap={3} component="form" onSubmit={handleSubmit(onSubmit)}>
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
              <SelectPermissions control={control} setValue={setValue} />
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
          >
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton variant="contained" size="large" type="submit">
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
