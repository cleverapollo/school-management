import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Tt_AddLessonOptions, Room, Person } from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFSelect,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { Lesson } from '../../../hooks/use-resource-table';
import {
  useAddLessonOptionsQuery,
  ReturnTypeFromAddLessonOptionsQuery,
} from '../../../api/edit-timetable/add-lesson-options';
import { useAddIndividualLesson } from '../../../api/edit-timetable/add-individual-lesson';

interface DeleteLessonModalProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson | null;
}

type FreeRoomsProps = Pick<Room, 'roomId' | 'name'>;

type FreeStaffProps = Pick<Person, 'firstName'>;

export function AddLessonModal({
  timetableId,
  isOpen,
  onClose,
  lessons,
}: DeleteLessonModalProps) {
  const { t } = useTranslation(['common', 'timetable']);

  const dayIdx = Number(lessons?.timeslotId?.dayIdx);
  const periodIdx = Number(lessons?.timeslotId?.periodIdx);
  const gridIdx = Number(lessons?.timeslotId?.gridIdx);
  const timetableGroupId = Number(lessons?.id?.timetableGroupId);

  const { resolver, rules } = useFormValidator();
  const { control, handleSubmit, reset } =
    useForm<ReturnTypeFromAddLessonOptionsQuery>({
      resolver: resolver({
        rooms: [rules.required()],
        // groups: [rules.required()],
        // staff: [rules.required()],
      }),
    });

  const dataForAddLessonOptionsQuery = {
    timetableId,
    timeslot: {
      gridIdx: Number(gridIdx),
      dayIdx: Number(dayIdx),
      periodIdx: Number(periodIdx),
    },
  };

  const { data: addLessonOptions } = useAddLessonOptionsQuery(
    dataForAddLessonOptionsQuery
  );

  const { mutate: addLesson, isLoading } = useAddIndividualLesson();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = () => {
    const transformedData = {
      timetableId,
      gridIdx,
      dayIdx,
      periodIdx,
      timetableGroupId,
      teachersPartyIds: [0, 0],
      roomId: 0,
    };

    addLesson(transformedData);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {t('timetable:addLesson')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={3} py={3}>
            <Stack direction="row" gap={2}>
              {/* @ts-ignore */}
              <RHFSelect<ReturnTypeFromAddLessonOptionsQuery, FreeRoomsProps>
                fullWidth
                options={addLessonOptions?.freeRooms ?? []}
                label="Rooms"
                optionIdKey="name"
                getOptionLabel={(option) => option?.name ?? ''}
                // controlProps={{
                //   name: 'name',
                //   control,
                // }}
              />
              {/* <RHFSelect<ReturnTypeFromAddLessonOptionsQuery, FreeStaffProps>
                fullWidth
                options={addLessonOptions?.freeStaff ?? []}
                label="Staff"
                optionIdKey=""
                getOptionLabel={(option) => option?.person?.firstName ?? ''}
                controlProps={{
                  name: 'staff',
                  control,
                }}
              /> */}
            </Stack>
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
