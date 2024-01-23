import {
  Button,
  Stack,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  RHFCheckbox,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  useFormValidator,
  DialogActions,
  Dialog,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  AttendanceCodeType,
  SaveAttendanceCodeInput,
  TuslaCode,
} from '@tyro/api';
import { useEffect } from 'react';
import { CloseIcon, InfoCircleIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseAttendanceCodes,
  useCreateOrUpdateAttendanceCode,
} from '../../api';

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
  active: boolean;
  isActive?: boolean;
};

export type EditAttendanceCodeViewProps = {
  initialAttendanceCodeState: Partial<EditAttendanceCodeFormState> | null;
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[];
  onClose: () => void;
};

export const EditAttendanceCodeModal = ({
  initialAttendanceCodeState,
  attendanceCodes,
  onClose,
}: EditAttendanceCodeViewProps) => {
  const { t, i18n } = useTranslation(['common', 'attendance']);
  const currentLanguageCode = i18n.language;
  const {
    mutate: createOrUpdateAttendanceCodeMutation,
    isLoading: isSubmitting,
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
          rules.isUniqueByKey(
            attendanceCodesWithoutSelf as [],
            'name',
            t('attendance:attendanceCodeNameShouldBeUnique')
          ),
        ],
        description: rules.required(),
        codeType: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  const onSubmit = ({
    name,
    description,
    isActive,
    ...restData
  }: EditAttendanceCodeFormState) => {
    createOrUpdateAttendanceCodeMutation(
      [
        {
          name: [{ locale: currentLanguageCode, value: name }],
          description: [{ locale: currentLanguageCode, value: description }],
          isActive: initialAttendanceCodeState?.id ? isActive : true,
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
        isActive: initialAttendanceCodeState?.active,
        ...defaultFormStateValues,
        ...initialAttendanceCodeState,
      });
    }
  }, [initialAttendanceCodeState]);

  const [code] = watch(['code']);

  useEffect(() => {
    if (code) {
      setValue('description', t(`attendance:tuslaCodeDescription.${code}`));
    } else {
      setValue('description', undefined);
    }
  }, [code]);

  const handleClearCode = () => {
    setValue('code', undefined);
  };

  return (
    <Dialog
      open={!!initialAttendanceCodeState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialAttendanceCodeState?.id
          ? t('attendance:editAttendanceCode')
          : t('attendance:createAttendanceCode')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <Stack direction="row" gap={2}>
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
            <RHFSelect<EditAttendanceCodeFormState, TuslaCode>
              fullWidth
              options={Object.values(TuslaCode)}
              label={t('attendance:tuslaCode')}
              getOptionLabel={(option) => option}
              InputProps={{
                endAdornment: code && (
                  <IconButton
                    sx={{ mr: 2 }}
                    type="button"
                    onClick={handleClearCode}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              controlProps={{
                name: 'code',
                control,
              }}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <RHFTextField<EditAttendanceCodeFormState>
              label={t('common:description')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                disabled: Boolean(code),
                inputProps: {
                  readOnly: Boolean(code),
                },
              }}
            />
            <RHFSelect<EditAttendanceCodeFormState, AttendanceCodeType>
              fullWidth
              options={Object.values(AttendanceCodeType).filter(
                (item) => item !== AttendanceCodeType.NotTaken
              )}
              label={t('attendance:reportAs')}
              getOptionLabel={(option) => t(`common:attendanceCode.${option}`)}
              controlProps={{
                name: 'codeType',
                control,
              }}
            />
          </Stack>
          {initialAttendanceCodeState?.id && (
            <Stack direction="column">
              <RHFSwitch
                label={t('common:active')}
                switchProps={{ color: 'primary' }}
                controlProps={{ name: 'isActive', control }}
              />
            </Stack>
          )}
          <Stack direction="column">
            <Typography variant="subtitle1">
              {t('attendance:availableTo')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('attendance:selectUserGroups')}
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
          <Button variant="outlined" color="inherit" onClick={onClose}>
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
