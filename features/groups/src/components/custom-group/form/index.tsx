import { useTranslation } from '@tyro/i18n';
import { useFormValidator, useDisclosure, ConfirmDialog } from '@tyro/core';
import { Card, Grid, Stack, Tab, CardHeader, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaticStudents } from './static-students';
import { CustomGroupFormState, TabOption } from './types';
import { GeneralInformation } from './general-information';
import { StaticStaff } from './static-staff';
import { useSaveCustomGroupDefinition } from '../../../api/custom-group-definition';

const defaultFormStateValues: Partial<CustomGroupFormState> = {
  staticStaff: [],
  staticStudents: [],
};

type CustomGroupFormProps = {
  initialState?: Partial<CustomGroupFormState>;
};

export const CustomGroupForm = ({ initialState }: CustomGroupFormProps) => {
  const { t } = useTranslation(['common', 'groups']);
  const navigate = useNavigate();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { resolver, rules } = useFormValidator<CustomGroupFormState>();
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<CustomGroupFormState>({
    defaultValues: defaultFormStateValues,
    resolver: resolver({
      name: rules.required(),
    }),
  });

  const { mutate, isLoading } = useSaveCustomGroupDefinition();

  const [tab, setTab] = useState<TabOption>(TabOption.STATIC_STUDENTS);

  const goBack = () => {
    navigate('..');
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
    ({ id, name, description, organisers, staticStaff, staticStudents }) => {
      mutate(
        {
          id,
          name,
          description,
          organisers: organisers.map(({ partyId }) => partyId),
          studentsStatic: staticStudents.map(({ partyId }) => partyId),
          staffStatic: staticStaff.map(({ partyId }) => partyId),
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
          <TabContext value={tab}>
            <CardHeader
              sx={{ pt: 1, pb: 0 }}
              title={
                <TabList onChange={(_, value: TabOption) => setTab(value)}>
                  <Tab
                    value={TabOption.STATIC_STUDENTS}
                    label={t('groups:staticStudents')}
                  />
                  <Tab
                    value={TabOption.STATIC_STAFF}
                    label={t('groups:staticStaff')}
                  />
                  {/* NOTE: first release won't include dynamic members */}
                  {/* <Tab
                    value={TabOption.DYNAMIC_STAFF}
                    label={t('groups:dynamicStudents')}
                  />
                  <Tab
                    value={TabOption.DYNAMIC_STUDENTS}
                    label={t('groups:dynamicStaff')}
                  /> */}
                </TabList>
              }
            />
            <TabPanel value={TabOption.STATIC_STUDENTS}>
              <StaticStudents
                control={control}
                setFocus={setFocus}
                setValue={setValue}
              />
            </TabPanel>
            <TabPanel value={TabOption.STATIC_STAFF}>
              <StaticStaff
                control={control}
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
            disabled={isLoading}
            onClick={handleCancelForm}
          >
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            size="large"
            type="submit"
          >
            {t('groups:saveCustomGroup')}
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
