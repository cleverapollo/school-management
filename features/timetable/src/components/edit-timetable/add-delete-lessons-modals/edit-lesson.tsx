import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  PartyGroup,
  Room,
  Staff,
  Tt_EditLessonFilter,
  TtEditLessonPeriodInstanceWrapper,
} from '@tyro/api';
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
import { useEditLessonOptionsQuery } from '../../../api/edit-timetable/edit-lesson-options';

export interface EditLessonProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

type FreeRoomsProps = Pick<Room, 'roomId' | 'name'>;

interface StaffInterface {
  id: number;
  value: number;
}
type FreeStaffProps = Pick<Staff, 'person' | 'partyId'>;
type FreeGroupProps = Pick<PartyGroup, 'name' | 'partyId'>;

export type EditLessonFormState = {
  roomId: FreeRoomsProps | null;
  staffIds: FreeStaffProps[];
  groupId: FreeGroupProps | null;
};

const initialValues = {
  groupId: null,
  staffIds: [],
  roomId: null,
};
export function EditLessonModal({
  timetableId,
  isOpen,
  onClose,
  lesson,
}: EditLessonProps) {
  const { t } = useTranslation(['common', 'timetable']);

  const { resolver, rules } = useFormValidator<EditLessonFormState>();
  const { control, handleSubmit, reset, setValue } =
    useForm<EditLessonFormState>({
      resolver: resolver({
        groupId: rules.required(),
      }),
      defaultValues: initialValues,
    });
  const dataForEditLessonOptionsQuery = {
    timetableId,
    lessonInstance: lesson?.id,
  } as Tt_EditLessonFilter;

  const { data: editLessonOptions } = useEditLessonOptionsQuery(
    dataForEditLessonOptionsQuery
  );

  const { mutate: editLesson, isLoading } = usEIn();

  const handleClose = () => {
    reset(initialValues);
    setValue('staffIds', []);
    setValue('roomId', null);
    setValue('groupId', null);
    onClose();
  };

  const onSubmit = ({ groupId, staffIds, roomId }: EditLessonFormState) => {
    const transformedData = {
      timetableId,
      gridIdx: period.gridIdx,
      dayIdx: period.dayIdx,
      periodIdx: period.periodIdx,
      timetableGroupId: groupId?.partyId,
      teachersPartyIds: staffIds.map((a) => a.partyId) ?? [],
      roomId: roomId?.roomId,
    } as Tt_EditLessonInput;

    editLesson(transformedData);
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
          day: dayjs().set('day', period.dayIdx).format('dddd'),
          period: period.periodIdx,
        })}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={3} py={3}>
            <Stack direction="row" gap={2}>
              <RHFAutocomplete<EditLessonFormState, FreeGroupProps>
                fullWidth
                options={editLessonOptions?.freeTimetableGroups ?? []}
                label={t('timetable:groupsAvailable')}
                getOptionLabel={(option) => option.name ?? ''}
                controlProps={{
                  name: 'groupId',
                  control,
                }}
              />

              <RHFAutocomplete<EditLessonFormState, FreeStaffProps>
                fullWidth
                multiple
                disableCloseOnSelect
                options={editLessonOptions?.freeStaff ?? []}
                label={t('timetable:teachersAvailable')}
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
              <RHFAutocomplete<EditLessonFormState, FreeRoomsProps>
                fullWidth
                options={editLessonOptions?.freeRooms ?? []}
                label={t('timetable:roomsAvailable')}
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
