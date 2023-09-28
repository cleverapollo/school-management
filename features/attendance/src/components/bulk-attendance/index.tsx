import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  IconButton,
  Stack,
} from '@mui/material';
import { Person, Search } from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  RHFDatePicker,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFTimePicker,
  useDebouncedValue,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { CloseIcon, LightBulbIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useSearchAutocompleteProps } from './use-search-autocomplete-props';
import { ReturnTypeFromUseBulkAttendance } from '../../api/bulk-attendance/bulk-attendance';
import { useCreateBulkAttendance } from '../../api/bulk-attendance/save-bulk-attendance';
import { useAttendanceCodes } from '../../api/attendance-codes';
import { useSessionPartySearch } from '../../api/session-party-search';

dayjs.extend(LocalizedFormat);

enum BulkAttendanceRequestType {
  MultiDay = 'MULTI_DAY',
  PartialDay = 'PARTIAL_DAY',
  SingleDay = 'SINGLE_DAY',
}

export type AutocompleteSearchType = Pick<
  Search,
  'avatarUrl' | 'partyId' | 'text' | 'type'
>;

export type BulkAttendanceModalProps = {
  open: boolean;
  initialModalState: Partial<ReturnTypeFromUseBulkAttendance> | null;
  onClose: () => void;
};

export type CreateBulkAttendanceFormState = {
  selectedStudentsOrGroups: AutocompleteSearchType;
  attendanceCodeId: number;
  date?: dayjs.Dayjs;
  dates?: Array<Dayjs>;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  note?: string;
  requestType: BulkAttendanceRequestType;
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
  const [openAlert, setOpenAlert] = useState(true);

  const { resolver, rules } = useFormValidator<CreateBulkAttendanceFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<CreateBulkAttendanceFormState>({
      resolver: resolver({
        date: [rules.date(), rules.required()],
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
      mode: 'onChange',
    });
  const requestType = watch('requestType');

  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });
  const { data: options, isLoading } =
    useSessionPartySearch(debouncedSearchValue);
  const { mutateAsync: saveBulkAttendance, isLoading: isSubmitting } =
    useCreateBulkAttendance();
  const { data: attendanceCodes = [] } = useAttendanceCodes({});

  const bulkAttendanceAutocompleteProps =
    useSearchAutocompleteProps<AutocompleteSearchType>();

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = (data: CreateBulkAttendanceFormState) => {
    const attendanceIdArrays = (function getAttendanceIds() {
      if (Array.isArray(data?.selectedStudentsOrGroups)) {
        const { selectedStudentsOrGroups } = data;
        return selectedStudentsOrGroups?.map((item: Person) => item?.partyId);
      }
    })();

    const sharedData = {
      attendanceCodeId: data?.attendanceCodeId,
      attendanceForPartyIds: attendanceIdArrays ?? [],
      note: data?.note,
    };

    if (data?.requestType === BulkAttendanceRequestType.SingleDay) {
      const transformedData = {
        ...sharedData,
        singleDate: {
          date: dayjs(data?.date).format('YYYY-MM-DD'),
        },
      };
      saveBulkAttendance(transformedData);
    }
    if (data?.requestType === BulkAttendanceRequestType.PartialDay) {
      const transformedData = {
        ...sharedData,
        partialDate: {
          date: dayjs(data?.date).format('YYYY-MM-DD'),
          leavesAt: dayjs(data?.startTime).format('HH:MM'),
          returnsAt: dayjs(data?.endTime).format('HH:MM'),
        },
      };
      saveBulkAttendance(transformedData);
    }
    reset();
    onClose();
  };

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
      <DialogTitle>{t('attendance:createBulkAttendance')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Collapse in={openAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              icon={
                <LightBulbIcon fontSize="inherit" sx={{ color: 'blue.800' }} />
              }
              sx={{
                marginBottom: 3,
                backgroundColor: 'indigo.50',
                color: 'blue.800',
              }}
            >
              <AlertTitle>
                {t('attendance:bulkAttendanceAlertTitle')}
              </AlertTitle>
              {t('attendance:bulkAttendanceAlertDescription')}
            </Alert>
          </Collapse>

          <Stack direction="column" sx={{ mt: 1 }} gap={2}>
            <RHFAutocomplete<
              CreateBulkAttendanceFormState,
              CreateBulkAttendanceFormState['selectedStudentsOrGroups']
            >
              fullWidth
              multiple
              disableCloseOnSelect
              options={options ?? []}
              label={t('common:name')}
              controlProps={{
                name: `selectedStudentsOrGroups`,
                control,
              }}
              open={searchValue.length > 0}
              loading={isLoading}
              onInputChange={(_, newInputValue) =>
                setSearchValue(newInputValue)
              }
              {...bulkAttendanceAutocompleteProps}
              sx={{ mt: 1 }}
            />
            <RHFSelect
              fullWidth
              optionIdKey="id"
              options={attendanceCodes ?? []}
              getOptionLabel={(option) => option.name || ''}
              label={t('attendance:attendance')}
              controlProps={{
                name: 'attendanceCodeId',
                control,
              }}
            />
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('attendance:attendance')}
              options={[
                BulkAttendanceRequestType.SingleDay,
                BulkAttendanceRequestType.PartialDay,
                BulkAttendanceRequestType.MultiDay,
              ].map((option) => ({
                value: option,
                label: t(`attendance:dayTypeOptions.${option}`),
              }))}
              controlProps={{
                name: 'requestType',
                control,
              }}
            />
            {requestType === BulkAttendanceRequestType.SingleDay && (
              <RHFDatePicker
                label={t('common:date')}
                controlProps={{
                  name: 'date',
                  control,
                  rules: { required: true },
                }}
                inputProps={{ sx: { flexGrow: 1 } }}
              />
            )}
            {requestType === BulkAttendanceRequestType.PartialDay && (
              <>
                <RHFDatePicker
                  label={t('common:date')}
                  controlProps={{
                    name: 'date',
                    control,
                    rules: { required: true },
                  }}
                  inputProps={{ sx: { flexGrow: 1 } }}
                />
                <RHFTimePicker
                  label={t('attendance:leavesAtTime')}
                  controlProps={{
                    name: 'startTime',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
                <RHFTimePicker
                  label={t('attendance:returnAtTime')}
                  controlProps={{
                    name: 'endTime',
                    control,
                    rules: {
                      required: true,
                    },
                  }}
                />
              </>
            )}
            {requestType === BulkAttendanceRequestType.MultiDay && (
              <div>Switcher will go here.</div>
            )}
            <RHFTextField
              label={t('attendance:note')}
              controlProps={{
                name: 'note',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
                rows: 4,
              }}
            />
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
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
