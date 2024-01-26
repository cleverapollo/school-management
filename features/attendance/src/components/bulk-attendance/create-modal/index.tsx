import { useEffect, useState } from 'react';
import { Attendance_SaveBulkAttendanceInput } from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AnimatePresence, m, Variants } from 'framer-motion';
import { Box, Button } from '@mui/material';
import { ArrowLeftIcon, ArrowRightIcon } from '@tyro/icons';
import { LoadingButton } from '@mui/lab';
import { usePeopleBasedOnPartyIds } from '@tyro/people';
import {
  BulkAttendanceRequestType,
  CreateBulkAttendanceFormState,
  CreateBulkAttendanceStepOneForm,
} from './step-one-form';
import { useCreateBulkAttendance } from '../../../api/bulk-attendance/save-bulk-attendance';
import { ReturnTypeFromUseBulkAttendance } from '../../../api/bulk-attendance/bulk-attendance';
import { SelectStudentsStepTwoForm } from './step-two-select-students';

dayjs.extend(LocalizedFormat);

export type BulkAttendanceModalProps = {
  open: boolean;
  initialModalState: Partial<ReturnTypeFromUseBulkAttendance> | null;
  onClose: () => void;
};

const defaultFormValue = {
  requestType: BulkAttendanceRequestType.SingleDay,
};

const animationVariants: Variants = {
  enter: (step: number) => ({
    x: step === 2 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
  }),
  center: {
    x: '0%',
    opacity: 1,
    position: 'relative',
  },
  exit: (step: number) => ({
    x: step === 2 ? '-100%' : '100%',
    opacity: 0,
    position: 'absolute',
  }),
};

export const BulkAttendanceModal = ({
  open,
  initialModalState,
  onClose,
}: BulkAttendanceModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const [step, setStep] = useState(1);
  const [excludedStudents, setExcludedStudents] = useState<Set<number>>(
    new Set<number>()
  );
  const isStep1 = step === 1;

  const { resolver, rules } = useFormValidator<CreateBulkAttendanceFormState>();
  const { control, handleSubmit, reset, watch } =
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

  const selectedStudentsOrGroups = watch('selectedStudentsOrGroups');
  const selectedStudentsOrGroupsPartyIds =
    selectedStudentsOrGroups?.map((item) => item?.partyId) ?? [];

  const { mutateAsync: saveBulkAttendance, isLoading: isSaving } =
    useCreateBulkAttendance();
  const { data: peopleFromSelectedGroups } = usePeopleBasedOnPartyIds(
    {
      partyIds: selectedStudentsOrGroupsPartyIds,
    },
    selectedStudentsOrGroupsPartyIds.length > 0
  );

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setExcludedStudents(new Set<number>());
    }, 300);
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
      exclusionPersonPartyIds: Array.from(excludedStudents),
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
    setExcludedStudents(new Set<number>());
  }, [selectedStudentsOrGroups]);

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
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <AnimatePresence initial={false} custom={step}>
          <Box
            component={m.div}
            key={step}
            custom={step}
            initial="enter"
            animate="center"
            exit="exit"
            variants={animationVariants}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            sx={{
              width: '100%',
            }}
          >
            {isStep1 ? (
              <CreateBulkAttendanceStepOneForm control={control} />
            ) : (
              <SelectStudentsStepTwoForm
                peopleFromSelectedGroups={peopleFromSelectedGroups}
                excludedStudents={excludedStudents}
                setExcludedStudents={setExcludedStudents}
              />
            )}
          </Box>
        </AnimatePresence>
      </DialogContent>
      <DialogActions>
        <Button
          variant="soft"
          color="inherit"
          startIcon={isStep1 ? undefined : <ArrowLeftIcon />}
          onClick={() => {
            if (isStep1) {
              handleClose();
            } else {
              setStep(step - 1);
            }
          }}
        >
          {isStep1 ? t('common:actions.cancel') : t('common:actions.back')}
        </Button>
        <LoadingButton
          loading={isSaving}
          variant="contained"
          endIcon={isStep1 ? <ArrowRightIcon /> : undefined}
          onClick={() => {
            if (isStep1) {
              onSubmitStepOne();
            } else {
              onSave();
            }
          }}
        >
          {isStep1 ? t('common:actions.next') : t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
