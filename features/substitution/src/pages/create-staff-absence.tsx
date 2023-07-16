import { Card, CardHeader, Typography, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {
  PageHeading,
  RHFAutocomplete,
  RHFTextField,
  RHFDatePicker,
  RHFSwitch,
  useToast,
  useFormValidator,
  useDisclosure,
  ConfirmDialog,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { usePeopleAutocompleteProps, useStaffForSelect } from '@tyro/people';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@tyro/api';
import dayjs from 'dayjs';

import {
  staffWorkAbsencesKeys,
  useSaveStaffAbsence,
  useStaffWorkAbsenceTypes,
} from '../api';

type StaffOption = NonNullable<
  NonNullable<ReturnType<typeof useStaffForSelect>['data']>
>[number];

type AbsenceTypeOption = NonNullable<
  NonNullable<ReturnType<typeof useStaffWorkAbsenceTypes>['data']>
>[number];

type FormValues = {
  staff: StaffOption;
  fromDate: Date;
  toDate: Date;
  absenceType: AbsenceTypeOption;
  typeNote: string;
  substitutionRequired: boolean;
};

export default function ManagementPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { t } = useTranslation(['substitution', 'common']);

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { data: staffData = [] } = useStaffForSelect({});
  const { data: absenceTypesData = [] } = useStaffWorkAbsenceTypes({});
  const {
    mutate: saveStaffAbsenceMutation,
    isLoading: isSaveStaffAbsenceLoading,
  } = useSaveStaffAbsence();

  const { resolver, rules } = useFormValidator<FormValues>();

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<FormValues>({
    resolver: resolver({
      staff: rules.required(),
      absenceType: rules.required(),
      fromDate: [rules.required(), rules.date()],
      toDate: [
        rules.required(),
        rules.date(),
        rules.afterStartDate('fromDate'),
      ],
    }),
  });

  const goBack = () => {
    navigate('/substitution/management', { replace: true });
  };

  const handleCancelForm = () => {
    if (isDirty) {
      onOpenCancelModal();
    } else {
      goBack();
    }
  };

  const onSubmit = ({
    staff,
    fromDate,
    toDate,
    absenceType,
    typeNote,
    substitutionRequired,
  }: FormValues) => {
    saveStaffAbsenceMutation(
      {
        staffPartyId: staff.partyId,
        absenceTypeId: absenceType.absenceTypeId,
        dates: [],
        // fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
        // toDate: dayjs(toDate).format('YYYY-MM-DD'),
        absenceReasonText: typeNote,
        substitutionRequired: !!substitutionRequired,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...staffWorkAbsencesKeys.list],
          });
          toast(t('common:snackbarMessages.createSuccess'));
          navigate('./..');
        },
        onError: console.error,
      }
    );
  };

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  const peopleAutocompleteProps = usePeopleAutocompleteProps<StaffOption>();

  return (
    <>
      <PageHeading
        title={t('substitution:management')}
        breadcrumbs={{
          links: [
            {
              name: t('substitution:management'),
              href: './..',
            },
            {
              name: t('substitution:creatingStaffAbsence'),
            },
          ],
        }}
      />
      <Card
        variant="outlined"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CardHeader
          component="h2"
          title={t('substitution:creatingStaffAbsence')}
        />
        <Stack direction="column" gap={3} p={3}>
          <Stack direction="column" gap={2.5}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('substitution:details')}
            </Typography>
            <RHFAutocomplete<FormValues, StaffOption>
              {...peopleAutocompleteProps}
              label={t('substitution:labels.staffName')}
              controlProps={{
                name: 'staff',
                control,
              }}
              sx={textFieldStyle}
              options={staffData}
            />
          </Stack>

          <Stack direction="column" gap={2.5}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('substitution:durationOfAbsence')}
            </Typography>
            <Stack direction="row" spacing={2}>
              <RHFDatePicker<FormValues>
                label={t('substitution:labels.startDate')}
                controlProps={{
                  name: 'fromDate',
                  control,
                }}
                inputProps={{
                  sx: textFieldStyle,
                }}
              />
              <RHFDatePicker<FormValues>
                label={t('substitution:labels.endDate')}
                controlProps={{
                  name: 'toDate',
                  control,
                }}
                inputProps={{
                  sx: textFieldStyle,
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="column" gap={2.5}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('substitution:reasonForAbsence')}
            </Typography>
            <RHFAutocomplete<FormValues, AbsenceTypeOption>
              label={t('substitution:labels.absenceType')}
              optionIdKey="absenceTypeId"
              optionTextKey="name"
              controlProps={{
                name: 'absenceType',
                control,
              }}
              sx={textFieldStyle}
              options={absenceTypesData}
            />
          </Stack>

          <Stack direction="column" gap={2.5}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('substitution:internalNote')}
            </Typography>
            <RHFTextField<FormValues>
              label={t('substitution:labels.internalNote')}
              textFieldProps={{
                multiline: true,
                minRows: 2,
                sx: textFieldStyle,
              }}
              controlProps={{
                name: 'typeNote',
                control,
              }}
            />
          </Stack>

          <RHFSwitch<FormValues>
            label={t('substitution:labels.requireSubstitution')}
            switchProps={{
              color: 'success',
            }}
            controlProps={{
              name: 'substitutionRequired',
              control,
            }}
          />

          <Stack direction="row" gap={2} justifyContent="flex-end">
            <Button
              variant="soft"
              size="large"
              color="primary"
              onClick={handleCancelForm}
            >
              {t('common:actions.cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              size="large"
              type="submit"
              loading={isSaveStaffAbsenceLoading}
            >
              {t('substitution:saveStaffAbsence')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={onCloseCancelModal}
        onConfirm={goBack}
      />
    </>
  );
}
