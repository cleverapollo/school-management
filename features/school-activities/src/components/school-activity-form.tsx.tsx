import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  RHFTimePicker,
  RHFRadioGroup,
  useFormValidator,
  useNumber,
  RHFDateRangePicker,
} from '@tyro/core';
import { useSubjectGroups } from '@tyro/groups';
import { UseQueryReturnType, ParentalAttendanceRequestType } from '@tyro/api';
import {
  Card,
  Collapse,
  Grid,
  Stack,
  CardHeader,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { useSaveSchoolActivities } from '../api/upsert-school-activity';
import { useRoomsList, RoomList } from '../api/get-rooms';

type SubjectGroupOption = UseQueryReturnType<typeof useSubjectGroups>[number];

type FormValues = {
  id?: number;
  activityName: string;
  group: SubjectGroupOption;
  startDate: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  details: string;
  captureTarget: boolean;
  requestType: ParentalAttendanceRequestType;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  dateRange?: dayjs.Dayjs;
  room: RoomList[];
  note: string;
};

// type TermAssessmentFormProps = {
//     termAssessment?: FormValues;
//     title: string;
//     onSuccess: () => void;
//     onError: () => void;
// };

export function SchoolActivityForm() {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'schoolActivities']);
  const { data: rooms } = useRoomsList();
  const { data: subjectGroups } = useSubjectGroups();
  const { resolver, rules } = useFormValidator<FormValues>();
  const { control, handleSubmit, watch } = useForm<FormValues>({
    //   defaultValues: termAssessment,
    resolver: resolver({
      activityName: rules.required(),
      startDate: [rules.required(), rules.date()],
      endDate: [
        rules.required(),
        rules.date(),
        rules.afterStartDate('startDate'),
      ],
      captureTarget: rules.required(),
    }),
  });

  const {
    mutate: saveSchoolActivities,
    isLoading,
    // onSuccess,
  } = useSaveSchoolActivities();

  const onSubmit = (data: FormValues) => {
    console.log(data, 'Submit');
    const group = data?.group?.partyId;

    const roomIds = data?.room?.map((item) => item?.roomId);
    console.log(dayjs(data?.startDate).format('YYYY-MM-DD'), 'TESTING');

    const formattedData = {
      name: data?.activityName,
      groupPartyId: group,
      location: {
        inSchoolGrounds: data?.captureTarget,
        roomIds,
        locationDetails: data?.details,
      },
      notes: data?.note,
      time: {
        startDate: dayjs(data?.startDate).format('YYYY-MM-DD'),
        startTime: data?.startTime?.format('HH:mm'),
        endTime: data?.endTime?.format('HH:mm'),
      },
    };
    saveSchoolActivities(formattedData, {
      onSuccess: () => {
        // onSuccess?.();
        navigate('/activity');
      },
      // onError,
    });
  };

  const requestType = watch('requestType');

  return (
    <Grid container gap={3}>
      <Grid item xs={12} lg={10}>
        <Card
          variant="outlined"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CardHeader component="h2" title="Create school activity" />
          <Grid container spacing={3} p={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                {t('schoolActivities:details')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField<FormValues>
                label={t('schoolActivities:activityName')}
                textFieldProps={{
                  fullWidth: true,
                  placeholder: 'Activity name',
                  disabled: false,
                }}
                controlProps={{
                  name: 'activityName',
                  control,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete<FormValues, SubjectGroupOption>
                label={t('common:group')}
                optionIdKey="partyId"
                optionTextKey="name"
                controlProps={{
                  control,
                  name: 'group',
                }}
                fullWidth
                options={subjectGroups ?? []}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFRadioGroup
                radioGroupProps={{ sx: { flexDirection: 'row' } }}
                label={t('schoolActivities:activityType')}
                options={[
                  ParentalAttendanceRequestType.SingleDay,
                  ParentalAttendanceRequestType.PartialDay,
                  ParentalAttendanceRequestType.MultiDay,
                ].map((option) => ({
                  value: option,
                  label: t(`schoolActivities:dayTypeOptions.${option}`),
                }))}
                controlProps={{
                  name: 'requestType',
                  control,
                }}
              />
            </Grid>
            {requestType === ParentalAttendanceRequestType.SingleDay && (
              <Grid item xs={12} sm={6}>
                <RHFDatePicker<FormValues>
                  label={t('schoolActivities:startDate')}
                  controlProps={{ name: 'startDate', control }}
                  inputProps={{
                    fullWidth: true,
                    placeholder: 'Activity name',
                    disabled: false,
                  }}
                />
              </Grid>
            )}
            {requestType === ParentalAttendanceRequestType.PartialDay && (
              <>
                <Grid item xs={12} sm={4}>
                  <RHFDatePicker<FormValues>
                    label={t('schoolActivities:startDate')}
                    controlProps={{ name: 'startDate', control }}
                    inputProps={{
                      fullWidth: true,
                      disabled: false,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RHFTimePicker
                    label={t('schoolActivities:leavesAtTime')}
                    controlProps={{
                      name: 'startTime',
                      control,
                    }}
                    inputProps={{
                      fullWidth: true,
                      disabled: false,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RHFTimePicker
                    label={t('schoolActivities:returnsAtTime')}
                    controlProps={{
                      name: 'endTime',
                      control,
                    }}
                    inputProps={{
                      fullWidth: true,
                      disabled: false,
                    }}
                  />
                </Grid>
              </>
            )}

            {requestType === ParentalAttendanceRequestType.MultiDay && (
              <Grid item xs={12} sm={6}>
                <RHFDateRangePicker
                  controlProps={{
                    name: 'dateRange',
                    control,
                  }}
                  textFieldProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <RHFTextField<FormValues>
                label={t('schoolActivities:details')}
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  minRows: 2,
                  placeholder: 'Activity name',
                  disabled: false,
                }}
                controlProps={{
                  name: 'details',
                  control,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFSwitch<FormValues>
                label={t('schoolActivities:onSchoolGrounds')}
                switchProps={{ color: 'success' }}
                controlProps={{ name: 'captureTarget', control }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <RHFAutocomplete<FormValues, RoomList>
                label={t('schoolActivities:room')}
                optionIdKey="roomId"
                optionTextKey="name"
                controlProps={{
                  control,
                  name: 'room',
                }}
                multiple
                fullWidth
                options={rooms ?? []}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField<FormValues>
                label={t('common:note')}
                textFieldProps={{
                  fullWidth: true,
                }}
                controlProps={{
                  name: 'note',
                  control,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} ml={3} mb={3}>
            <LoadingButton
              variant="contained"
              size="large"
              type="submit"
              loading={isLoading}
            >
              {t('common:actions.save')}
            </LoadingButton>
          </Grid>
          {/* <Stack alignItems="flex-end">
            <LoadingButton
              variant="contained"
              size="large"
              type="submit"
              loading={isLoading}
            >
              {t('common:actions.save')}
            </LoadingButton>
          </Stack> */}
        </Card>
      </Grid>
    </Grid>
  );
}
