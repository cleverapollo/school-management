import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import {
  ParentalAttendanceRequestStatus,
  ParentalAttendanceRequestType,
} from '@tyro/api';
import {
  RHFDateTimePicker,
  RHFSelect,
  RHFTextField,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useStudents } from '@tyro/people';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useForm } from 'react-hook-form';
import { useAttendanceCodes, useCreateOrUpdateAbsentRequest } from '../../api';

dayjs.extend(LocalizedFormat);

export interface CreateAbsentRequestModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export type CreateAbsentRequestFormState = {
  studentId: number;
  attendanceCodeId: number;
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
  parentNote: string;
  requestType: ParentalAttendanceRequestType;
};

export const CreateAbsentRequestModal = ({
  isOpen,
  onClose,
}: CreateAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance', 'people']);
  const { data: attendanceCodes = [] } = useAttendanceCodes({});
  const { data: students = [] } = useStudents();

  const { resolver, rules } = useFormValidator<CreateAbsentRequestFormState>();
  const { control, handleSubmit, reset } =
    useForm<CreateAbsentRequestFormState>({
      resolver: resolver({
        studentId: rules.required(),
        attendanceCodeId: rules.required(),
        from: rules.required(),
        to: rules.required(),
        parentNote: rules.required(),
        requestType: rules.required(),
      }),
    });

  const { mutate, isLoading } = useCreateOrUpdateAbsentRequest();
  const { displayName } = usePreferredNameLayout();

  const onSubmit = (data: CreateAbsentRequestFormState) => {
    mutate(
      [
        {
          attendanceCodeId: data.attendanceCodeId,
          from: data.from.toISOString(),
          to: data.to.toISOString(),
          parentNote: data.parentNote,
          requestType: data.requestType,
          status: ParentalAttendanceRequestStatus.Pending,
          studentPartyId: data.studentId,
        },
      ],
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('attendance:createAbsentRequest')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack direction="column" sx={{ mt: 2 }} gap={2}>
            <RHFSelect
              fullWidth
              optionIdKey="partyId"
              options={students}
              label={t('common:student')}
              getOptionLabel={(option) => displayName(option.person)}
              controlProps={{
                name: 'studentId',
                control,
              }}
            />
            <RHFSelect
              fullWidth
              options={Object.values(ParentalAttendanceRequestType)}
              label={t('attendance:requestType')}
              getOptionLabel={(option) =>
                t(`attendance:absenceRequestType.${option}`)
              }
              controlProps={{
                name: 'requestType',
                control,
              }}
            />
            <Stack direction="row" gap={2}>
              <RHFDateTimePicker
                label={t('common:startDate')}
                controlProps={{
                  name: 'from',
                  control,
                }}
                inputProps={{ sx: { flexGrow: 1 } }}
              />
              <RHFDateTimePicker
                label={t('common:endDate')}
                controlProps={{
                  name: 'to',
                  control,
                }}
                inputProps={{ sx: { flexGrow: 1 } }}
              />
            </Stack>
            <RHFSelect
              fullWidth
              optionIdKey="id"
              options={attendanceCodes}
              label={t('attendance:attendance')}
              getOptionLabel={(option) => option.name}
              controlProps={{
                name: 'attendanceCodeId',
                control,
              }}
            />
            <RHFTextField
              label={t('attendance:note')}
              controlProps={{
                name: 'parentNote',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
