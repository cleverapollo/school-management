import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Tt_AddLessonOptions,
  Room,
  Person,
  Staff,
  PartyGroup,
  Tt_AddLessonInput,
} from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  RHFSelect,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import React from 'react';
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

interface StaffInterface {
  id: number;
  value: number;
}
type FreeStaffProps = Pick<Staff, 'person' | 'partyId'>;
type FreeGroupProps = Pick<PartyGroup, 'name' | 'partyId'>;

export type AddLessonFormState = {
  roomId: FreeRoomsProps;
  staffIds: FreeStaffProps[];
  groupId: FreeGroupProps;
};

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

  const { resolver, rules } = useFormValidator<AddLessonFormState>();
  const { control, handleSubmit, reset } = useForm<AddLessonFormState>({
    resolver: resolver({
      groupId: rules.required(),
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

  const onSubmit = ({ groupId, staffIds, roomId }: AddLessonFormState) => {
    const transformedData = {
      timetableId,
      gridIdx,
      dayIdx,
      periodIdx,
      timetableGroupId: groupId.partyId,
      teachersPartyIds: staffIds.map((a) => a.partyId) ?? [],
      roomId: roomId.roomId,
    } as Tt_AddLessonInput;

    addLesson(transformedData);
    onClose();
  };

  // @ts-ignore
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
              <RHFAutocomplete<AddLessonFormState, FreeRoomsProps>
                fullWidth
                options={addLessonOptions?.freeRooms ?? []}
                label="Rooms"
                optionIdKey="name"
                getOptionLabel={(option) => option?.name ?? ''}
                controlProps={{
                  name: 'roomId',
                  control,
                }}
              />
              <RHFAutocomplete<AddLessonFormState, FreeStaffProps>
                fullWidth
                multiple
                options={addLessonOptions?.freeStaff ?? []}
                label="Free Staff"
                getOptionLabel={(option) =>
                  `${option?.person?.firstName} ${option?.person?.lastName}` ??
                  ''
                }
                controlProps={{
                  name: 'staffIds',
                  control,
                }}
              />
              <RHFAutocomplete<AddLessonFormState, FreeGroupProps>
                fullWidth
                options={addLessonOptions?.freeTimetableGroups ?? []}
                label="Free Groups"
                getOptionLabel={(option) => option.name ?? ''}
                controlProps={{
                  name: 'groupId',
                  control,
                }}
              />
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
