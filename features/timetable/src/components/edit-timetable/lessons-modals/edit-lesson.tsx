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
import { usePeopleAutocompleteProps } from '@tyro/people';
import { useEffect } from 'react';
import {
  useEditLessonOptionsQuery,
  ReturnTypeFromEditLessonOptionsQuery,
} from '../../../api/edit-timetable/edit-lesson-options ';
import { Lesson } from '../../../hooks/use-resource-table';
import { useUpdateTimetableLessons } from '../../../api/update-timetable-lessons';

export interface AddLessonProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

export type EditLessonFormState = {
  room: ReturnTypeFromEditLessonOptionsQuery['freeRooms'][number] | null;
  staff: ReturnTypeFromEditLessonOptionsQuery['freeStaff'];
  group: ReturnTypeFromEditLessonOptionsQuery['freeTimetableGroups'][number];
};

export function EditLessonModal({
  timetableId,
  isOpen,
  onClose,
  lesson,
}: AddLessonProps) {
  const { t } = useTranslation(['common', 'timetable']);

  const { resolver, rules } = useFormValidator<EditLessonFormState>();
  const { control, handleSubmit, reset } = useForm<EditLessonFormState>({
    resolver: resolver({
      group: rules.required(),
    }),
  });
  const timeslot = lesson?.timeslotId ?? {
    gridIdx: 0,
    dayIdx: 0,
    periodIdx: 0,
  };

  const { data: editLessonOptions } = useEditLessonOptionsQuery(
    {
      timetableId,
      lessonInstance: lesson?.id ?? {
        lessonIdx: 0,
        lessonInstanceIdx: 0,
        timetableGroupId: 0,
      },
    },
    !!lesson?.id
  );

  const { mutateAsync: editLesson, isLoading } = useUpdateTimetableLessons();
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<
      ReturnTypeFromEditLessonOptionsQuery['freeStaff'][number]
    >();

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async ({ staff, room }: EditLessonFormState) => {
    const transformedData = {
      timetableId,
      allowClashes: true,
      lessonsInstances: [
        {
          id: lesson?.id,
          roomId: room?.roomId,
          teachersPartyIds: staff.map(({ partyId }) => partyId) ?? [],
          timeslot,
        },
      ],
    };

    await editLesson(transformedData);
    handleClose();
  };

  useEffect(() => {
    if (lesson) {
      reset({
        staff: lesson?.teachers.map(({ person }) => person) ?? [],
        room: lesson?.room,
      });
    }
  }, [lesson]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {t('timetable:editSessionModalHeader', {
          subjectGroup: lesson?.partyGroup?.name,
          day: dayjs().set('day', timeslot.dayIdx).format('dddd'),
          period: timeslot.periodIdx,
        })}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={2} pt={1}>
            <RHFAutocomplete<
              EditLessonFormState,
              EditLessonFormState['staff'][number]
            >
              fullWidth
              multiple
              disableCloseOnSelect
              options={editLessonOptions?.freeStaff ?? []}
              label={t('timetable:teachersAvailable')}
              {...peopleAutocompleteProps}
              controlProps={{
                name: 'staff',
                control,
              }}
            />
            <RHFAutocomplete<
              EditLessonFormState,
              NonNullable<EditLessonFormState['room']>
            >
              fullWidth
              options={editLessonOptions?.freeRooms ?? []}
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
