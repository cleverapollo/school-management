import {
  Card,
  CardHeader,
  Typography,
  Stack,
  Box,
  SxProps,
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

  const { data: staffData = [] } = useStaff({});
  const { data: absenceTypesData = [] } = useStaffWorkAbsenceTypes({});
  const {
    mutate: saveStaffAbsenceMutation,
    isLoading: isSaveStaffAbsenceLoading,
  } = useSaveStaffAbsence();

  const { handleSubmit, control, getValues } = useForm<FormValues>();

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
        fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
        toDate: dayjs(toDate).format('YYYY-MM-DD'),
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

  const labelStyle = {
    color: 'slate.400',
    fontWeight: 600,
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
          title={t('substitution:creatingStaffAbsence')}
          sx={{
            p: 3,
            pt: 2.25,
            pb: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
        <Stack direction="column" gap={3} p={3}>
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" sx={{ ...labelStyle }}>
              {t('substitution:details')}
            </Typography>
            <RHFAutocomplete<FormValues, StaffOption>
              label={t('substitution:labels.staffName')}
              optionIdKey="partyId"
              controlProps={{
                name: 'staff',
                control,
                rules: {
                  required: t('common:errorMessages.required'),
                },
              }}
              autocompleteProps={{
                popupIcon: null,
                sx: textFieldStyle,
                options: staffData,
                getOptionLabel: ({ person }) => displayName(person),
                renderOption: (props, { person }, { selected }) => (
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
                      src={person.avatarUrl ?? undefined}
                    />
                    {displayName(person)}
                  </Box>
                ),
              }}
            />
          </Stack>

          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" sx={{ ...labelStyle }}>
              {t('substitution:durationOfAbsence')}
            </Typography>
            <Stack direction="row" spacing={2}>
              <RHFDatePicker<FormValues>
                label={t('substitution:labels.startDate')}
                controlProps={{
                  name: 'fromDate',
                  control,
                  rules: {
                    required: t('common:errorMessages.required'),
                    validate: {
                      invalid: (date) =>
                        dayjs(date as Date).isValid() ||
                        t('common:errorMessages.invalidDate'),
                    },
                  },
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
                  rules: {
                    required: t('common:errorMessages.required'),
                    validate: {
                      invalid: (date) =>
                        dayjs(date as Date).isValid() ||
                        t('common:errorMessages.invalidDate'),
                      beforeStartDate: (date) =>
                        dayjs(date as Date).isAfter(getValues('fromDate')) ||
                        t('common:errorMessages.beforeStartDate'),
                    },
                  },
                }}
                inputProps={{
                  sx: textFieldStyle,
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" sx={{ ...labelStyle }}>
              {t('substitution:reasonForAbsence')}
            </Typography>
            <RHFAutocomplete<FormValues, AbsenceTypeOption>
              label={t('substitution:labels.absenceType')}
              optionIdKey="absenceTypeId"
              optionTextKey="name"
              controlProps={{
                name: 'absenceType',
                control,
                rules: {
                  required: t('common:errorMessages.required'),
                },
              }}
              autocompleteProps={{
                popupIcon: null,
                sx: textFieldStyle,
                options: absenceTypesData,
              }}
            />
          </Stack>

          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" sx={{ ...labelStyle }}>
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

          <Stack alignItems="flex-end">
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
    </>
  );
}
