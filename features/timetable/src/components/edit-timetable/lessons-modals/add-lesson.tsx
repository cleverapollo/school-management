import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { CalendarParty } from '@tyro/calendar';
import { usePeopleAutocompleteProps } from '@tyro/people';
import { useEffect } from 'react';
import {
  ReturnTypeFromAddLessonOptionsQuery,
  useAddLessonOptionsQuery,
} from '../../../api/edit-timetable/add-lesson-options';
import { useAddIndividualLesson } from '../../../api/edit-timetable/add-individual-lesson';
import { Period } from '../types';

export interface AddLessonProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  period: Period | null;
  selectedParties: CalendarParty[];
}

export type AddLessonFormState = {
  room: ReturnTypeFromAddLessonOptionsQuery['freeRooms'][number] | null;
  staff: ReturnTypeFromAddLessonOptionsQuery['freeStaff'];
  group: ReturnTypeFromAddLessonOptionsQuery['freeTimetableGroups'][number];
};

export function AddLessonModal({
  timetableId,
  isOpen,
  onClose,
  period,
  selectedParties,
}: AddLessonProps) {
  const { t } = useTranslation(['common', 'timetable']);

  const { resolver, rules } = useFormValidator<AddLessonFormState>();
  const { control, handleSubmit, reset } = useForm<AddLessonFormState>({
    resolver: resolver({
      group: rules.required(),
    }),
  });

  const { data: addLessonOptions } = useAddLessonOptionsQuery(
    {
      timetableId,
      timeslot: {
        gridIdx: period?.gridIdx ?? 0,
        dayIdx: period?.dayIdx ?? 0,
        periodIdx: period?.periodIdx ?? 0,
      },
      timetableGroupIds: selectedParties.map(({ partyId }) => partyId) ?? [],
    },
    !!period
  );

  const { mutateAsync: addLesson, isLoading } = useAddIndividualLesson();
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<
      ReturnTypeFromAddLessonOptionsQuery['freeStaff'][number]
    >();

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async ({ group, staff, room }: AddLessonFormState) => {
    const transformedData = {
      timetableId,
      gridIdx: period?.gridIdx ?? 0,
      dayIdx: period?.dayIdx ?? 0,
      periodIdx: period?.periodIdx ?? 0,
      timetableGroupId: group?.partyId ?? 0,
      teachersPartyIds: staff.map(({ partyId }) => partyId) ?? [],
      roomId: room?.roomId,
    };

    await addLesson(transformedData);
    handleClose();
  };

  useEffect(() => {
    if (period) {
      reset();
    }
  }, [period]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {t('timetable:addSessionModalHeader', {
          day: dayjs()
            .set('day', period?.dayIdx ?? 0)
            .format('dddd'),
          period: period?.periodIdx ?? 0,
        })}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={2} pt={1}>
            <RHFAutocomplete<
              AddLessonFormState,
              NonNullable<AddLessonFormState['group']>
            >
              fullWidth
              options={addLessonOptions?.freeTimetableGroups ?? []}
              label={t('timetable:groupsAvailable')}
              getOptionLabel={(option) => option.name ?? ''}
              controlProps={{
                name: 'group',
                control,
              }}
            />

            <RHFAutocomplete<
              AddLessonFormState,
              AddLessonFormState['staff'][number]
            >
              fullWidth
              multiple
              disableCloseOnSelect
              options={addLessonOptions?.freeStaff ?? []}
              label={t('timetable:teachersAvailable')}
              {...peopleAutocompleteProps}
              controlProps={{
                name: 'staff',
                control,
              }}
            />
            <RHFAutocomplete<
              AddLessonFormState,
              NonNullable<AddLessonFormState['room']>
            >
              fullWidth
              options={addLessonOptions?.freeRooms ?? []}
              label={t('timetable:roomsAvailable')}
              optionIdKey="name"
              getOptionLabel={(option) => option?.name ?? ''}
              controlProps={{
                name: 'room',
                control,
              }}
            />
          </Stack>
        </DialogContent>
        <Stack>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              {t('common:actions.cancel')}
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              {t('common:actions.save')}
            </LoadingButton>
          </DialogActions>
        </Stack>
      </form>
    </Dialog>
  );
}
