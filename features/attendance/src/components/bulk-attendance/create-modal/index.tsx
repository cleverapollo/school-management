import { useEffect, useState } from 'react';
import { Attendance_SaveBulkAttendanceInput } from '@tyro/api';
import { Dialog, DialogTitle, useFormValidator } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ReturnTypeFromUseBulkAttendance } from '../../../api/bulk-attendance/bulk-attendance';
import { useCreateBulkAttendance } from '../../../api/bulk-attendance/save-bulk-attendance';
import {
  BulkAttendanceRequestType,
  CreateBulkAttendanceFormState,
  CreateBulkAttendanceStepOneForm,
} from './step-one-form';

dayjs.extend(LocalizedFormat);

export type BulkAttendanceModalProps = {
  open: boolean;
  initialModalState: Partial<ReturnTypeFromUseBulkAttendance> | null;
  onClose: () => void;
};

const defaultFormValue = {
  requestType: BulkAttendanceRequestType.SingleDay,
};

export const BulkAttendanceModal = ({
  open,
  initialModalState,
  onClose,
}: BulkAttendanceModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const [step, setStep] = useState(1);

  const { resolver, rules } = useFormValidator<CreateBulkAttendanceFormState>();
  const { control, handleSubmit, reset, watch, trigger } =
    useForm<CreateBulkAttendanceFormState>({
      resolver: resolver({
        date: [rules.date(), rules.required()],
        dateRange: [rules.date(), rules.required()],
        startTime: [
          rules.required(),
          rules.date(t('common:errorMessages.invalidTime')),
        ],
        endTime: [
          rules.required(),
          rules.date(t('common:errorMessages.invalidTime')),
          rules.afterStartDate(
            'startTime',
            t('common:errorMessages.afterStartTime')
          ),
        ],
        selectedStudentsOrGroups: [rules.required()],
        attendanceCodeId: [rules.required()],
      }),
    });

  const { mutateAsync: saveBulkAttendance, isLoading: isSubmitting } =
    useCreateBulkAttendance();

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmitStepOne = handleSubmit(() => {
    setStep(2);
  });

  const onSave = handleSubmit((data) => {
    const attendanceIdArrays = data.selectedStudentsOrGroups.map(
      (item) => item?.partyId
    );

    const transformedData: Attendance_SaveBulkAttendanceInput = {
      attendanceCodeId: data.attendanceCodeId,
      attendanceForPartyIds: attendanceIdArrays,
      note: data.note,
    };

    if (data?.requestType === BulkAttendanceRequestType.SingleDay) {
      transformedData.singleDate = {
        date: dayjs(data?.date).format('YYYY-MM-DD'),
      };
    }
    if (data?.requestType === BulkAttendanceRequestType.PartialDay) {
      transformedData.partialDate = {
        date: dayjs(data?.date).format('YYYY-MM-DD'),
        leavesAt: dayjs(data?.startTime).format('HH:mm'),
        returnsAt: dayjs(data?.endTime).format('HH:mm'),
      };
    }
    if (data?.requestType === BulkAttendanceRequestType.MultiDay) {
      transformedData.multiDate = {
        startDate: dayjs(data?.dateRange[0]).format('YYYY-MM-DD'),
        endDate: dayjs(data?.dateRange[1]).format('YYYY-MM-DD'),
      };
    }
    saveBulkAttendance(transformedData, {
      onSuccess: handleClose,
    });
  });

  useEffect(() => {
    if (initialModalState) {
      reset({
        ...defaultFormValue,
      });
    }
  }, [initialModalState]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {t('attendance:createBulkAttendance')}
      </DialogTitle>
      <CreateBulkAttendanceStepOneForm
        control={control}
        onSubmit={onSubmitStepOne}
        onClose={handleClose}
      />
    </Dialog>
  );
};
