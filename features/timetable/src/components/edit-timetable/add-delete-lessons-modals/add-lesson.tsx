import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { PartyGroup, Room, Staff, Tt_AddLessonInput } from '@tyro/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  useFormValidator,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import React from 'react';
import dayjs from 'dayjs';
import { Lesson } from '../../../hooks/use-resource-table';
import { useAddLessonOptionsQuery } from '../../../api/edit-timetable/add-lesson-options';
import { useAddIndividualLesson } from '../../../api/edit-timetable/add-individual-lesson';
import { Period } from '../types';

export interface AddLessonProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  period: Period;
}

type FreeRoomsProps = Pick<Room, 'roomId' | 'name'>;

interface StaffInterface {
  id: number;
  value: number;
}
type FreeStaffProps = Pick<Staff, 'person' | 'partyId'>;
type FreeGroupProps = Pick<PartyGroup, 'name' | 'partyId'>;

export type AddLessonFormState = {
  roomId: FreeRoomsProps | null;
  staffIds: FreeStaffProps[];
  groupId: FreeGroupProps | null;
};

const initialValues = {
  groupId: null,
  staffIds: [],
  roomId: null,
};
export function AddLessonModal({
  timetableId,
  isOpen,
  onClose,
  period,
}: AddLessonProps) {
  const { t } = useTranslation(['common', 'timetable']);

  const { resolver, rules } = useFormValidator<AddLessonFormState>();
  const { control, handleSubmit, reset, setValue } =
    useForm<AddLessonFormState>({
      resolver: resolver({
        groupId: rules.required(),
      }),
      defaultValues: initialValues,
    });
  const dataForAddLessonOptionsQuery = {
    timetableId,
    timeslot: {
      gridIdx: Number(period.gridIdx),
      dayIdx: Number(period.dayIdx),
      periodIdx: Number(period.periodIdx),
    },
  };

  const { data: addLessonOptions } = useAddLessonOptionsQuery(
    dataForAddLessonOptionsQuery
  );

  const { mutate: addLesson, isLoading } = useAddIndividualLesson();

  const handleClose = () => {
    reset(initialValues);
    setValue('staffIds', []);
    setValue('roomId', null);
    setValue('groupId', null);
    onClose();
  };

  const onSubmit = ({ groupId, staffIds, roomId }: AddLessonFormState) => {
    const transformedData = {
      timetableId,
      gridIdx: period.gridIdx,
      dayIdx: period.dayIdx,
      periodIdx: period.periodIdx,
      timetableGroupId: groupId?.partyId,
      teachersPartyIds: staffIds.map((a) => a.partyId) ?? [],
      roomId: roomId?.roomId,
    } as Tt_AddLessonInput;

    addLesson(transformedData);
    handleClose();
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
        {t('timetable:addSessionModalHeader', {
          day: dayjs().set('day', period.dayIdx).format('ddd'),
          period: period.periodIdx,
        })}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={3} py={3}>
            <Stack direction="row" gap={2}>
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

              <RHFAutocomplete<AddLessonFormState, FreeStaffProps>
                fullWidth
                multiple
                options={addLessonOptions?.freeStaff ?? []}
                label="Free Staff"
                getOptionLabel={(option) =>
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  `${option?.person?.firstName} ${option?.person?.lastName}` ??
                  ''
                }
                controlProps={{
                  name: 'staffIds',
                  control,
                }}
              />
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
