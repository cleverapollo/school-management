import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFRadioGroup,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { TtGroupStudentMembershipTypeEnum } from '@tyro/api';
import { useForm } from 'react-hook-form';
import { RHFStaffAutocomplete, StaffSelectOption } from '@tyro/people';
import {
  BlocksSelect,
  ClassGroupSelect,
  RHFBlocksSelectAutocomplete,
  RHFClassGroupAutocomplete,
} from '@tyro/groups';
import React from 'react';
import { ReturnTypeFromUseTimetableSubjectGroups } from '../../../api/edit-timetable/subject-groups';

export interface UpsertSubjectGroupProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  initialState: ReturnTypeFromUseTimetableSubjectGroups | null;
}

export type UpsertSubjectGroupFormState = {
  name: string;
  classGroup: ClassGroupSelect;
  membershipType: TtGroupStudentMembershipTypeEnum;
  block: BlocksSelect;
  teachers: StaffSelectOption[];
};

export function UpsertSubjectGroupModal({
  timetableId,
  isOpen,
  onClose,
  initialState,
}: UpsertSubjectGroupProps) {
  const { t } = useTranslation(['common', 'timetable']);
  console.log(initialState);
  const { resolver, rules } = useFormValidator<UpsertSubjectGroupFormState>();
  const { control, handleSubmit, reset, watch } =
    useForm<UpsertSubjectGroupFormState>({
      resolver: resolver({
        name: rules.required(),
        membershipType: rules.required(),
      }),
    });

  const handleClose = () => {
    onClose();
  };

  const membershipType = watch('membershipType');

  const onSubmit = async ({ name }: UpsertSubjectGroupFormState) => {
    // const transformedData = {
    //   timetableId,
    //   allowClashes: true,
    //   lessonsInstances: [
    //     {
    //       id: lesson?.id,
    //       roomId: room?.roomId,
    //       teachersPartyIds: staff.map(({ partyId }) => partyId) ?? [],
    //       timeslot,
    //     },
    //   ],
    // };
    //
    // await editLesson(transformedData);
    handleClose();
  };
  //
  // useEffect(() => {
  //   if (lesson) {
  //     reset({
  //       staff: lesson?.teachers.map(({ person }) => person) ?? [],
  //       room: lesson?.room,
  //     });
  //   }
  // }, [lesson]);
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('timetable:createSubjectGroup')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={2} pt={1}>
            <RHFTextField
              label={t('common:name')}
              controlProps={{
                name: 'name',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                sx: {
                  maxWidth: 360,
                },
              }}
            />
          </Stack>
          <Stack gap={2} pt={1}>
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('timetable:studentMembershipType')}
              options={[
                TtGroupStudentMembershipTypeEnum.Core,
                TtGroupStudentMembershipTypeEnum.Block,
              ].map((option) => ({
                value: option,
                label: t(`timetable:studentMembershipTypeEnum.${option}`),
              }))}
              controlProps={{
                name: 'membershipType',
                control,
              }}
            />
          </Stack>

          {TtGroupStudentMembershipTypeEnum.Block === membershipType && (
            <Stack gap={2} pt={1}>
              <RHFBlocksSelectAutocomplete
                controlProps={{
                  name: 'block',
                  control,
                }}
              />
            </Stack>
          )}
          {TtGroupStudentMembershipTypeEnum.Core === membershipType && (
            <Stack gap={2} pt={1}>
              <RHFClassGroupAutocomplete
                controlProps={{
                  name: 'classGroup',
                  control,
                }}
              />
            </Stack>
          )}
          <Stack gap={2} pt={1}>
            <RHFStaffAutocomplete
              multiple
              controlProps={{
                name: 'teachers',

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

            <LoadingButton type="submit" variant="contained" loading={false}>
              {t('common:actions.save')}
            </LoadingButton>
          </DialogActions>
        </Stack>
      </form>
    </Dialog>
  );
}
