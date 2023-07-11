import {
  Card,
  CardHeader,
  Typography,
  Stack,
  Box,
  SxProps,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {
  PageHeading,
  RHFAutocomplete,
  RHFTextField,
  RHFDatePicker,
  RHFSwitch,
  Avatar,
  usePreferredNameLayout,
  useToast,
  useFormValidator,
  useDisclosure,
  ConfirmDialog,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { CheckmarkIcon } from '@tyro/icons';
import { useStaff } from '@tyro/people';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@tyro/api';
import dayjs from 'dayjs';

import {
  staffWorkAbsencesKeys,
  useSaveStaffAbsence,
  useStaffWorkAbsenceTypes,
} from '../api';

type StaffOption = NonNullable<
  NonNullable<ReturnType<typeof useStaff>['data']>
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
  const { displayName } = usePreferredNameLayout();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { data: staffData = [] } = useStaff({});
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
              label={t('substitution:labels.staffName')}
              optionIdKey="partyId"
              controlProps={{
                name: 'staff',
                control,
              }}
              sx={textFieldStyle}
              options={staffData}
              getOptionLabel={({ person }) => displayName(person)}
              renderOption={(props, { person }, { selected }) => (
                <Box
                  component="li"
                  {...props}
                  gap={2}
                  sx={{
                    '&.MuiAutocomplete-option': {
                      px: 1,
                    },
                  }}
                >
                  {selected && (
                    <Box
                      position="absolute"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width={32}
                      zIndex={1}
                    >
                      <CheckmarkIcon color="success" fontSize="small" />
                    </Box>
                  )}
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      ...((selected && {
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'common.black',
                          opacity: 0.6,
                        },
                      }) as SxProps),
                    }}
                    name={displayName(person)}
                    src={person.avatarUrl}
                  />
                  {displayName(person)}
                </Box>
              )}
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
