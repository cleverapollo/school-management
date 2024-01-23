import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import {
  ConfirmDialog,
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFTimePicker,
  RHFRadioGroup,
  useFormValidator,
  useDisclosure,
  RHFDateRangePicker,
} from '@tyro/core';
import {
  useCustomGroups,
  StudentsSearchParty,
  useStudentsSearchProps,
} from '@tyro/groups';

import {
  AbsenceTypeAutoComplete,
  StaffWorkAbsenceTypeOption,
} from '@tyro/substitution';

import { UseQueryReturnType, Sa_SchoolActivityDateInput } from '@tyro/api';
import {
  Button,
  Card,
  CardHeader,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Tab,
  Typography,
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import {
  ListPeoplePagination,
  RHFStaffAutocomplete,
  StaffSelectOption,
  StudentSelectOption,
} from '@tyro/people';
import React, { useCallback, useEffect, useState } from 'react';
import { useSaveSchoolActivities } from '../../api/upsert-school-activity';
import { useRoomsList, RoomList } from '../../api/get-rooms';
import { ActivityType } from '../../pages/edit';

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
  partial?: boolean;
  dates?: dayjs.Dayjs;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  dateRange?: dayjs.Dayjs[];
  requestType: ActivityType;
  locationDetails?: string | null;
  organisers?: StaffSelectOption[] | null;
  staticStudents?: StudentSelectOption[] | null;
  staticStaff?: StaffSelectOption[] | null;
  absenceType?: StaffWorkAbsenceTypeOption;
  absenceTypeId?: number | null;
};

export type SchoolActivitiesFormProps = {
  schoolActivitiesData?: FormValues;
  title: string;
  onSuccess: () => void;
  onError: () => void;
};

export enum TabOption {
  STATIC_STUDENTS = 'staticStudents',
  DYNAMIC_STUDENTS = 'dynamicStudents',
  STATIC_STAFF = 'staticStaff',
  DYNAMIC_STAFF = 'dynamicStaff',
}

export function SchoolActivityForm({
  schoolActivitiesData,
  title,
  onSuccess,
  onError,
}: SchoolActivitiesFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'groups', 'schoolActivities']);
  const [tab, setTab] = useState<TabOption>(TabOption.STATIC_STUDENTS);
  const [isCustomGroup, setIsCustomGroup] = useState(false);

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { data: rooms } = useRoomsList();
  const { data: customGroups = [] } = useCustomGroups();

  const { resolver, rules } = useFormValidator<FormValues>();
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    resetField,
    watch,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: schoolActivitiesData,
    resolver: resolver({
      name: rules.required(),
      dates: [rules.required(), rules.date()],
      dateRange: rules.required(),
      inSchoolGrounds: rules.required(),
      group: rules.required(),
      absenceType: rules.required(),
    }),
  });
  const { mutate: saveSchoolActivities, isLoading } = useSaveSchoolActivities();

  const activityDayType = watch('requestType');
  const isActivityInSchool = watch('inSchoolGrounds');
  const students = useWatch({ control, name: 'staticStudents' });
  const staff = useWatch({ control, name: 'staticStaff' });

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
              startTime: data?.startTime
                ? dayjs(data?.startTime).format('HH:mm:ss')
                : '08:30',
              endTime: data?.endTime
                ? dayjs(data?.endTime).format('HH:mm:ss')
                : '16:00',
            },
          ];
        }
        case ActivityType.PartialDay: {
          return [
            {
              dates: [dayjs(data?.dates).format('YYYY-MM-DD')],
              partial: true,
              startTime: dayjs(data?.startTime).format('HH:mm:ss'),
              endTime: dayjs(data?.endTime).format('HH:mm:ss'),
            },
          ];
        }
        case ActivityType.MultiDay: {
          const { dateRange } = data;
          if (dateRange) {
            const start = dayjs(dateRange[0]);
            const end = dayjs(dateRange[1]);
            let current = start;
            const dates = [];
            while (current.isSameOrBefore(end)) {
              dates.push(current.format('YYYY-MM-DD'));
              current = current.add(1, 'day');
            }

            return [
              {
                dates,
                partial: false,
                startTime: data.startTime
                  ? dayjs(data.startTime).format('HH:mm:ss')
                  : '08:00',
                endTime: data.endTime
                  ? dayjs(data.endTime).format('HH:mm:ss')
                  : '18:00',
              },
            ];
          }
          return [];
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
        customGroupId: isCustomGroup ? null : group,
        createCustomGroup: isCustomGroup
          ? {
              organiserIds: data?.organisers?.map(
                (organiser) => organiser?.partyId
              ),
              staffIds: data?.staticStaff?.map((person) => person?.partyId),
              studentIds: data?.staticStudents?.map(
                (student) => student?.partyId
              ),
            }
          : null,
      },
      location: {
        inSchoolGrounds: data?.inSchoolGrounds,
        roomIds: data?.inSchoolGrounds ? roomIdsFormatted : [],
        locationDetails: data?.inSchoolGrounds ? null : data?.locationDetails,
      },
      tripPurpose: data?.details,
      dates: datesFormatted,
      notes: data?.notes,
      staffAbsenceType: data?.absenceType?.absenceTypeId ?? 0,
    };
    saveSchoolActivities(formattedData, {
      onSuccess: () => {
        onSuccess?.();
        navigate('/school-activity');
      },
    });
  };

  const removeStudent = useCallback(
    (currentPartyId: number) => {
      if (students) {
        setValue(
          'staticStudents',
          students.filter(({ partyId }) => currentPartyId !== partyId)
        );
      }
    },
    [setValue, students]
  );

  const removeStaff = useCallback(
    (currentPartyId: number) => {
      if (staff) {
        setValue(
          'staticStaff',
          staff.filter(({ partyId }) => currentPartyId !== partyId)
        );
      }
    },
    [setValue, staff]
  );

  const goBack = () => {
    navigate('..');
  };

  const handleCancelForm = () => {
    if (isDirty) {
      onOpenCancelModal();
    } else {
      goBack();
    }
  };

  const studentsGroups = useStudentsSearchProps({
    unshiftMode: true,
    renderAvatarTags: () => null,
  });

  const isFullOrPartialDay =
    activityDayType === ActivityType.PartialDay ||
    activityDayType === ActivityType.SingleDay;

  useEffect(() => {
    if (activityDayType === ActivityType.PartialDay) {
      setValue('startTime', undefined);
      setValue('endTime', undefined);
    }
  }, [activityDayType, setValue, schoolActivitiesData]);

  useEffect(() => {
    const isFullDay = activityDayType === ActivityType.SingleDay;

    setValue('startTime', isFullDay ? dayjs('08:30', 'HH:mm') : undefined);
    setValue('endTime', isFullDay ? dayjs('16:00', 'HH:mm') : undefined);
  }, [activityDayType]);

  return (
    <Grid container gap={3} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12} lg={10}>
        <Card variant="outlined">
          <CardHeader component="h2" title={title} />
          <Grid container spacing={3} p={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                {t('common:groups')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                label={t('schoolActivities:name')}
                textFieldProps={{
                  fullWidth: true,
                }}
                controlProps={{
                  name: 'name',
                  control,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {!isEditing && (
                <Grid item xs={12} pb={3}>
                  <FormControlLabel
                    sx={{
                      '& .css-1oiwml7-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
                        { backgroundColor: '#22c55e' },
                    }}
                    control={
                      <Switch
                        checked={isCustomGroup}
                        onChange={() => {
                          setIsCustomGroup(!isCustomGroup);
                        }}
                      />
                    }
                    label={t('schoolActivities:createCustomGroup')}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                {isCustomGroup ? (
                  <RHFStaffAutocomplete
                    label={t('groups:organisers')}
                    multiple
                    controlProps={{
                      name: 'organisers',
                      control,
                    }}
                  />
                ) : (
                  <RHFAutocomplete
                    label={t('schoolActivities:searchCustomGroup')}
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
                )}
              </Grid>
            </Grid>
          </Grid>
          {isCustomGroup && (
            <Grid container gap={2}>
              <Grid item xs={12}>
                <TabContext value={tab}>
                  <CardHeader
                    sx={{ pt: 1, pb: 0 }}
                    title={
                      <TabList
                        onChange={(_, value: TabOption) => setTab(value)}
                      >
                        <Tab
                          value={TabOption.STATIC_STUDENTS}
                          label={t('groups:staticStudents')}
                        />
                        <Tab
                          value={TabOption.STATIC_STAFF}
                          label={t('groups:staticStaff')}
                        />
                      </TabList>
                    }
                  />
                  <TabPanel value={TabOption.STATIC_STUDENTS}>
                    <Grid container gap={2}>
                      <Grid item xs={12}>
                        <RHFAutocomplete<FormValues, StudentsSearchParty, true>
                          {...studentsGroups}
                          controlProps={{
                            control,
                            name: 'staticStudents',
                          }}
                        />
                      </Grid>
                      <ListPeoplePagination
                        people={students || []}
                        emptyTitle={t('groups:noStaticStudents')}
                        emptyDescription={t('groups:noStaticStudentsCta')}
                        noFoundMessage={t('groups:noStudentsFound')}
                        removeLabel={t('groups:removeStudent')}
                        onFocus={() => setFocus('staticStudents')}
                        onRemove={removeStudent}
                      />
                    </Grid>
                  </TabPanel>
                  <TabPanel value={TabOption.STATIC_STAFF}>
                    <Grid container gap={2}>
                      <Grid item xs={12}>
                        <RHFStaffAutocomplete
                          multiple
                          unshiftMode
                          filterSelectedOptions
                          label={t('common:searchByMemberType.STAFF')}
                          renderAvatarTags={() => null}
                          controlProps={{
                            control,
                            name: 'staticStaff',
                          }}
                        />
                      </Grid>
                      <ListPeoplePagination
                        people={staff || []}
                        emptyTitle={t('groups:noStaticStaff')}
                        emptyDescription={t('groups:noStaticStaffCta')}
                        noFoundMessage={t('groups:noStaffFound')}
                        removeLabel={t('groups:removeStaff')}
                        onFocus={() => setFocus('staticStaff')}
                        onRemove={removeStaff}
                      />
                    </Grid>
                  </TabPanel>
                </TabContext>
              </Grid>
            </Grid>
          )}
        </Card>

        <Card variant="outlined" sx={{ marginTop: 3 }}>
          <CardHeader component="h2" title={t('schoolActivities:details')} />
          <Grid container spacing={3} p={3}>
            <Grid item xs={12}>
              <RHFRadioGroup
                radioGroupProps={{ sx: { flexDirection: 'row' } }}
                label={t('schoolActivities:activityDateAndTime')}
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
            {isFullOrPartialDay && (
              <>
                <Grid item xs={12} sm={4}>
                  <RHFDatePicker
                    label={t('schoolActivities:startDate')}
                    controlProps={{ name: 'dates', control }}
                    inputProps={{
                      fullWidth: true,
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
              <RHFTextField
                label={t('schoolActivities:activityDetails')}
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  minRows: 2,
                }}
                controlProps={{
                  name: 'details',
                  control,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <AbsenceTypeAutoComplete
                label={t('schoolActivities:staffAbsenceReason')}
                controlProps={{
                  name: 'absenceType',
                  control,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFSwitch
                label={t('schoolActivities:onSchoolGrounds')}
                switchProps={{ color: 'success' }}
                controlProps={{ name: 'inSchoolGrounds', control }}
              />
            </Grid>

            {isActivityInSchool ? (
              <Grid item xs={12} sm={6}>
                <RHFAutocomplete
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
            ) : (
              <Grid item xs={12}>
                <RHFTextField
                  label={t('schoolActivities:locationDetails')}
                  textFieldProps={{
                    fullWidth: true,
                    multiline: true,
                    minRows: 1,
                  }}
                  controlProps={{
                    name: 'locationDetails',
                    control,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <RHFTextField
                label={t('schoolActivities:internalNote')}
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  minRows: 2,
                }}
                controlProps={{
                  name: 'notes',
                  control,
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} lg={10}>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          {!isEditing && (
            <Button
              variant="soft"
              size="large"
              color="primary"
              disabled={isLoading}
              onClick={handleCancelForm}
            >
              {t('common:actions.cancel')}
            </Button>
          )}
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
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={onCloseCancelModal}
        onConfirm={goBack}
      />
    </Grid>
  );
}
