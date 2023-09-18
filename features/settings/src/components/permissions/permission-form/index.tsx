import { Grid, Tab, Card, CardHeader, Button, Stack } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { ConfirmDialog, useDisclosure, useFormValidator } from '@tyro/core';
import { useNavigate } from 'react-router-dom';
import { MemberType } from '@tyro/api';
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
  permissionsFieldsBySetId: {},
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
    handleSubmit,
    setFocus,
    setValue,
    reset,
    getFieldState,
    formState: { isDirty },
  } = useForm<PermissionFormState>({
    defaultValues: defaultFormStateValues,
    resolver: resolver({
      name: rules.required(),
      description: rules.required(),
      memberType: rules.required(),
    }),
  });

  const memberType = useWatch({ name: 'memberType', control });

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
      reset({
        ...defaultFormStateValues,
        ...initialState,
      });
    }
  }, [initialState]);

  const onSubmit = handleSubmit(
    ({
      id: groupId,
      name,
      description,
      memberType: memberTypeValue,
      members: memberParties,
      isMemberTypeAdmin,
      permissionsFieldsBySetId,
    }) => {
      const locale = i18n.language;

      savePermissionGroupMutation(
        {
          id: groupId,
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
          memberType: isMemberTypeAdmin ? MemberType.Admin : memberTypeValue,
          memberPartyIds: memberParties.map(
            (memberParty) => memberParty.partyId
          ),
          permissionSets: Object.values(permissionsFieldsBySetId).filter(
            (permission) =>
              typeof permission.toggle === 'boolean' ||
              permission.permissionType
          ),
        },
        {
          onSuccess: goBack,
        }
      );
    }
  );

  useEffect(() => {
    if (isDirty) {
      setValue('members', []);
      setTab(TabOption.PERMISSIONS);
    }
  }, [memberType]);

  const { isDirty: isMemberTypeDirty } = getFieldState('memberType');

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
                isMemberTypeDirty={isMemberTypeDirty}
                memberType={memberType}
                control={control}
                setValue={setValue}
              />
            </TabPanel>
            <TabPanel value={TabOption.MEMBERS}>
              <AssignMembers
                control={control}
                memberType={memberType}
                setFocus={setFocus}
                setValue={setValue}
              />
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
      <Grid item xs={12} lg={10}>
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
