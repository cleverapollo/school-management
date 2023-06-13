import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  Box,
} from '@mui/material';
import {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { AttendanceCodeType, SaveAttendanceCodeInput } from '@tyro/api';
import React, { useEffect } from 'react';
import {
  CheckmarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@tyro/icons';
import { ReturnTypeFromUseAttendanceCodes } from '../../pages/attendance-codes';
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
  description?: string;
};

export type EditAttendanceCodeViewProps = {
  initialAttendanceCodeState?: EditAttendanceCodeFormState | undefined;
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[];
  onClose: () => void;
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

  const [isExpand, setIsExpand] = React.useState(true);

  const { resolver, rules } = useFormValidator<EditAttendanceCodeFormState>();

  const defaultFormStateValues: Partial<EditAttendanceCodeFormState> = {
    ...initialAttendanceCodeState,
  };

  const attendanceCodesWithoutSelf = attendanceCodes.filter(
    (attendanceCode) =>
      attendanceCode?.code !== initialAttendanceCodeState?.code
  );

  const { control, handleSubmit, reset, watch } =
    useForm<EditAttendanceCodeFormState>({
      resolver: resolver({
        name: rules.required(),
        code: [
          rules.required(),
          rules.isUniqueByKey(
            attendanceCodesWithoutSelf as [],
            'code',
            t('attendance:attendanceCodeShouldBeUnique')
          ),
        ],
        description: rules.required(),
        codeType: rules.required(),
      }),
      defaultValues: defaultFormStateValues,
      mode: 'onChange',
    });

  const onSubmit = ({ name, ...restData }: EditAttendanceCodeFormState) => {
    console.log('restData', restData);
    createOrUpdateAttendanceCodeMutation(
      {
        name: [{ locale: 'en', value: name }],
        ...restData,
      },
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

  const [visibleForTeacher, visibleForContact] = watch([
    'visibleForTeacher',
    'visibleForContact',
  ]);

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

            <RHFTextField<EditAttendanceCodeFormState>
              label={t('attendance:tuslaCode')}
              controlProps={{
                name: 'code',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
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
            }}
          >
            <ListItemButton
              onClick={() => setIsExpand(!isExpand)}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            >
              <ListItemIcon>
                <CheckmarkCircleIcon
                  sx={{
                    color: 'indigo.500',
                  }}
                />
              </ListItemIcon>
              <Typography
                sx={{ flex: 1, textTransform: 'uppercase' }}
                variant="subtitle2"
              >
                {t('attendance:someEnabled')}
              </Typography>
              {isExpand ? (
                <ChevronDownIcon sx={{ ml: 1, flexShrink: 0 }} />
              ) : (
                <ChevronUpIcon sx={{ ml: 1, flexShrink: 0 }} />
              )}
            </ListItemButton>
            <Collapse in={isExpand} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton disableRipple disableTouchRipple sx={{ pl: 4 }}>
                  <Typography sx={{ flex: 1 }} variant="body2">
                    {t('attendance:teachers')}
                  </Typography>
                  <RHFSwitch<EditAttendanceCodeFormState>
                    label={visibleForTeacher ? t('common:yes') : t('common:no')}
                    switchProps={{
                      color: 'primary',
                    }}
                    controlProps={{
                      name: 'visibleForTeacher',
                      control,
                    }}
                  />
                </ListItemButton>
                <ListItemButton disableRipple disableTouchRipple sx={{ pl: 4 }}>
                  <Typography sx={{ flex: 1 }} variant="body2">
                    {t('attendance:contacts')}
                  </Typography>
                  <RHFSwitch<EditAttendanceCodeFormState>
                    label={visibleForContact ? t('common:yes') : t('common:no')}
                    switchProps={{
                      color: 'primary',
                    }}
                    controlProps={{
                      name: 'visibleForContact',
                      control,
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
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
