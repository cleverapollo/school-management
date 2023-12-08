import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFTimePicker,
  RHFRadioGroup,
  useFormValidator,
  RHFDateRangePicker,
} from '@tyro/core';
import { useCustomGroups } from '@tyro/groups';
import { UseQueryReturnType, Sa_SchoolActivityDateInput } from '@tyro/api';
import { Card, Grid, CardHeader, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useSaveSchoolActivities } from '../api/upsert-school-activity';
import { useRoomsList, RoomList } from '../api/get-rooms';
import { ActivityType } from '../pages/edit';

type ReturnTypeFromUseCustomGroups = UseQueryReturnType<
  typeof useCustomGroups
>[number];

export type FormValues = {
  schoolActivityId?: number;
  name: string | null | undefined;
  group: ReturnTypeFromUseCustomGroups;
  details: string | null | undefined;
  notes: string | null | undefined;
  room: RoomList | null;
  inSchoolGrounds: boolean;
  partial: boolean;
  dates?: dayjs.Dayjs;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  dateRange?: dayjs.Dayjs[];
  requestType: ActivityType;
};

export type SchoolActivitiesFormProps = {
  schoolActivitiesData?: FormValues;
  title: string;
  onSuccess: () => void;
  onError: () => void;
};

export function SchoolActivityForm({
  schoolActivitiesData,
  title,
  onSuccess,
  onError,
}: SchoolActivitiesFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'schoolActivities']);
  const { data: rooms } = useRoomsList();
  const { data: customGroups = [] } = useCustomGroups();

  const { resolver, rules } = useFormValidator<FormValues>();
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: schoolActivitiesData,
    resolver: resolver({
      name: rules.required(),
      dates: [rules.required(), rules.date()],
      inSchoolGrounds: rules.required(),
    }),
  });

  const { mutate: saveSchoolActivities, isLoading } = useSaveSchoolActivities();
  const activityDayType = watch('requestType');
  const isEditing = !!schoolActivitiesData?.schoolActivityId;

  const onSubmit = (data: FormValues) => {
    const group = data?.group?.partyId;
    const roomIds = data?.room && data?.room?.roomId;

    function formatDates(type: ActivityType): Sa_SchoolActivityDateInput[] {
      switch (type) {
        case ActivityType.SingleDay: {
          return [
            {
              dates: [dayjs(data?.dates).format('YYYY-MM-DD')],
              partial: false,
              startTime: '08:00',
              endTime: '18:00',
            },
          ];
        }
        case ActivityType.PartialDay: {
          return [
            {
              dates: [dayjs(data?.dates).format('YYYY-MM-DD')],
              partial: true,
              startTime: dayjs(data?.startTime).format('hh:mm:ss'),
              endTime: dayjs(data?.endTime).format('hh:mm:ss'),
            },
          ];
        }
        case ActivityType.MultiDay: {
          const dateRangeFormatted =
            data?.dateRange?.map((date) => dayjs(date).format('YYYY-MM-DD')) ||
            [];

          return [
            {
              dates: dateRangeFormatted,
              partial: false,
              startTime: '08:00',
              endTime: '18:00',
            },
          ];
        }
        default:
          return [];
      }
    }

    const datesFormatted = formatDates(activityDayType);
    const roomIdsFormatted = roomIds !== null ? [roomIds] : [];

    const formattedData = {
      schoolActivityId: data?.schoolActivityId,
      name: data?.name as string,
      group: {
        customGroupId: group,
      },
      location: {
        inSchoolGrounds: data?.inSchoolGrounds,
        roomIds: roomIdsFormatted,
      },
      tripPurpose: data?.details,
      dates: datesFormatted,
      notes: data?.notes,
    };

    saveSchoolActivities(formattedData, {
      onSuccess: () => {
        onSuccess?.();
        navigate('/school-activity');
      },
    });
  };

  return (
    <Grid container gap={3}>
      <Grid item xs={12} lg={10}>
        <Card
          variant="outlined"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CardHeader component="h2" title={title} />
          <Grid container spacing={3} p={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                {t('schoolActivities:details')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField<FormValues>
                label={t('schoolActivities:name')}
                textFieldProps={{
                  fullWidth: true,
                  placeholder: 'Activity name',
                  disabled: false,
                }}
                controlProps={{
                  name: 'name',
                  control,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete<FormValues, ReturnTypeFromUseCustomGroups>
                label={t('common:group')}
                optionIdKey="partyId"
                optionTextKey="name"
                controlProps={{
                  control,
                  name: 'group',
                }}
                disabled={isEditing}
                fullWidth
                options={customGroups ?? []}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFRadioGroup
                radioGroupProps={{ sx: { flexDirection: 'row' } }}
                label={t('schoolActivities:activityType')}
                options={[
                  ActivityType.SingleDay,
                  ActivityType.PartialDay,
                  ActivityType.MultiDay,
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
            {activityDayType === ActivityType.SingleDay && (
              <Grid item xs={12} sm={6}>
                <RHFDatePicker<FormValues>
                  label={t('schoolActivities:startDate')}
                  controlProps={{ name: 'dates', control }}
                  inputProps={{
                    fullWidth: true,
                    placeholder: 'Activity name',
                    disabled: false,
                  }}
                />
              </Grid>
            )}
            {activityDayType === ActivityType.PartialDay && (
              <>
                <Grid item xs={12} sm={4}>
                  <RHFDatePicker<FormValues>
                    label={t('schoolActivities:startDate')}
                    controlProps={{ name: 'dates', control }}
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

            {activityDayType === ActivityType.MultiDay && (
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
                controlProps={{ name: 'inSchoolGrounds', control }}
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
                  name: 'notes',
                  control,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} pb={3} pr={3}>
            <Stack direction="row" gap={2} justifyContent="flex-end">
              <LoadingButton
                variant="contained"
                size="large"
                type="submit"
                loading={isLoading}
              >
                {t('common:actions.save')}
              </LoadingButton>
            </Stack>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
