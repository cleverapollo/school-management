import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { AttendanceCodeType, SaveAttendanceCodeInput } from '@tyro/api';
import React, { useEffect } from 'react';
import { InfoCircleIcon } from '@tyro/icons';
import { ReturnTypeFromUseAttendanceCodes } from '../../pages/codes';
import { useCreateOrUpdateAttendanceCode } from '../../api';

export type EditAttendanceCodeFormState = Pick<
  SaveAttendanceCodeInput,
  | 'id'
  | 'code'
  | 'isActive'
  | 'visibleForTeacher'
  | 'visibleForContact'
  | 'codeType'
> & {
  name: string;
  description?: string | null;
  visibleForAdmin?: boolean;
};

export type EditAttendanceCodeViewProps = {
  initialAttendanceCodeState?: EditAttendanceCodeFormState | undefined;
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[];
  onClose: () => void;
};

export const codeDescriptionMapping = {
  A: 'Student illness',
  B: 'Urgent family matter',
  C: 'Expelled from school',
  D: 'Suspended from school',
  E: 'Other explained absence',
  F: 'Unexplained absence',
  G: 'Transferred to another school',
  H: 'Student on holiday',
};

export const EditAttendanceCodeModal = ({
  initialAttendanceCodeState,
  attendanceCodes,
  onClose,
}: EditAttendanceCodeViewProps) => {
  const { t } = useTranslation(['common', 'attendance']);

  const {
    mutate: createOrUpdateAttendanceCodeMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateAttendanceCode();

  const { resolver, rules } = useFormValidator<EditAttendanceCodeFormState>();

  const defaultFormStateValues: Partial<EditAttendanceCodeFormState> = {
    ...initialAttendanceCodeState,
    visibleForAdmin: true,
  };

  const attendanceCodesWithoutSelf = attendanceCodes.filter(
    (attendanceCode) =>
      attendanceCode?.code !== initialAttendanceCodeState?.code
  );

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<EditAttendanceCodeFormState>({
      resolver: resolver({
        name: [
          rules.required(),
          rules.max(20),
          rules.isUniqueByKey(
            attendanceCodesWithoutSelf as [],
            'name',
            t('attendance:attendanceCodeNameShouldBeUnique')
          ),
        ],
        description: [rules.required(), rules.max(20)],
        codeType: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  const onSubmit = ({
    name,
    description,
    ...restData
  }: EditAttendanceCodeFormState) => {
    createOrUpdateAttendanceCodeMutation(
      [
        {
          name: [{ locale: 'en', value: name }],
          description: [{ locale: 'en', value: description }],
          isActive: true,
          ...restData,
        },
      ],
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialAttendanceCodeState) {
      reset({
        ...defaultFormStateValues,
        ...initialAttendanceCodeState,
      });
    }
  }, [initialAttendanceCodeState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const [code] = watch(['code']);

  useEffect(() => {
    if (code !== undefined) {
      setValue(
        'description',
        codeDescriptionMapping[code as keyof typeof codeDescriptionMapping]
      );
    }
  }, [code]);

  return (
    <Dialog
      open={!!initialAttendanceCodeState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {initialAttendanceCodeState?.id
          ? t('attendance:editAttendanceCode')
          : t('attendance:createAttendanceCode')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row" gap={1}>
            <RHFTextField<EditAttendanceCodeFormState>
              label={t('attendance:attendanceCodeName')}
              controlProps={{
                name: 'name',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFSelect<EditAttendanceCodeFormState, string>
              fullWidth
              options={Object.keys(codeDescriptionMapping)}
              label={t('attendance:tuslaCode')}
              getOptionLabel={(option) => option}
              controlProps={{
                name: 'code',
                control,
              }}
            />
          </Stack>
          <Stack direction="row" gap={1}>
            <RHFTextField<EditAttendanceCodeFormState>
              label={t('common:description')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                inputProps: {
                  readOnly: code !== undefined,
                },
              }}
            />
            <RHFSelect<EditAttendanceCodeFormState, AttendanceCodeType>
              fullWidth
              options={Object.values(AttendanceCodeType)}
              label={t('attendance:reportAs')}
              getOptionLabel={(option) =>
                t(`attendance:tabNameByCodeType.${option}`)
              }
              controlProps={{
                name: 'codeType',
                control,
              }}
            />
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle1">
              {t('attendance:availableTo')}
            </Typography>
            <Typography sx={{ m: 0, p: 0 }} variant="caption">
              {t('attendance:whichUserGroupsHaveAccessToUseThisAttendanceCode')}
            </Typography>
          </Stack>

          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: 'slate.50',
              border: 1,
              borderColor: 'slate.200',
              width: '60%',
              p: 1,
            }}
          >
            <Tooltip
              key="visibleForAdmin"
              title={t(
                'attendance:administrationStaffAccessAllAttendanceCodesByDefault'
              )}
              describeChild
              placement="top-end"
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    marginBottom: '0 !important',
                  },
                },
              }}
            >
              <Stack>
                <RHFCheckbox
                  label={
                    <Stack direction="row" gap={0.5}>
                      {t('common:administration')}
                      <InfoCircleIcon sx={{ width: 18, height: 18 }} />
                    </Stack>
                  }
                  controlLabelProps={{
                    sx: { ml: 0, height: '100%' },
                  }}
                  checkboxProps={{
                    color: 'primary',
                    value: true,
                    disabled: true,
                  }}
                  controlProps={{ name: 'visibleForAdmin', control }}
                />
              </Stack>
            </Tooltip>
            <RHFCheckbox
              label={t('attendance:teachers')}
              controlLabelProps={{
                sx: { width: '100%', ml: 0, height: '100%' },
              }}
              checkboxProps={{ color: 'primary' }}
              controlProps={{ name: 'visibleForTeacher', control }}
            />
            <RHFCheckbox
              label={t('attendance:contacts')}
              controlLabelProps={{
                sx: { width: '100%', ml: 0, height: '100%' },
              }}
              checkboxProps={{ color: 'primary' }}
              controlProps={{ name: 'visibleForContact', control }}
            />
          </Box>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
