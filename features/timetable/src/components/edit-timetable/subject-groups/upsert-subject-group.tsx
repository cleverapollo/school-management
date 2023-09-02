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
import {
  SubjectGroupStudentMembershipTypeEnum,
  SubjectGroupType,
  Tt_UpsertSubjectGroup,
  TtGroupStudentMembershipTypeEnum,
} from '@tyro/api';
import { useForm } from 'react-hook-form';
import { RHFStaffAutocomplete, StaffSelectOption } from '@tyro/people';
import {
  BlocksSelect,
  ClassGroupSelect,
  RHFBlocksSelectAutocomplete,
  RHFClassGroupAutocomplete,
} from '@tyro/groups';
import React from 'react';
import { RHFSubjectAutocomplete, SubjectSelect } from '@tyro/settings';
import { ReturnTypeFromUseTimetableSubjectGroups } from '../../../api/edit-timetable/subject-groups';
import { useTtUpsertTimetableGroup } from '../../../api/edit-timetable/upsert-group';

export interface UpsertSubjectGroupProps {
  timetableId: number;
  isOpen: boolean;
  onClose: () => void;
  initialState: ReturnTypeFromUseTimetableSubjectGroups | null;
}

export type UpsertSubjectGroupFormState = {
  name: string | null;
  classGroup: ClassGroupSelect | null;
  membershipType: TtGroupStudentMembershipTypeEnum | null;
  groupType: SubjectGroupType;
  block: BlocksSelect | null;
  teachers: StaffSelectOption[] | null;
  subject: SubjectSelect | null;
};

const defaultState = {
  groupType: SubjectGroupType.SubjectGroup,
};

export function UpsertSubjectGroupModal({
  timetableId,
  isOpen,
  onClose,
  initialState,
}: UpsertSubjectGroupProps) {
  const { t } = useTranslation(['common', 'timetable', 'groups']);
  const { resolver, rules } = useFormValidator<UpsertSubjectGroupFormState>();
  const { mutateAsync: upsertGroup, isLoading } = useTtUpsertTimetableGroup();

  const { control, handleSubmit, reset, watch } =
    useForm<UpsertSubjectGroupFormState>({
      resolver: resolver({
        name: rules.required(),
        membershipType: rules.required(),
        subject: rules.required(),
      }),
      defaultValues: defaultState,
    });

  const handleClose = () => {
    onClose();
  };

  const membershipTypeWatch = watch('membershipType');

  const onSubmit = async ({
    name,
    membershipType,
    classGroup,
    block,
    teachers,
    subject,
    groupType,
  }: UpsertSubjectGroupFormState) => {
    const transformedData = {
      timetableId,
      id: initialState?.partyGroup?.partyId,
      name,
      membershipType,
      subjectGroupType: groupType,
      classGroupId:
        membershipType === TtGroupStudentMembershipTypeEnum.Core
          ? classGroup?.partyId
          : null,
      blockId:
        membershipType === TtGroupStudentMembershipTypeEnum.Block
          ? block?.blockId
          : null,
      subjectIds: [subject?.subjectId],
      teachers: teachers?.map((teacher) => teacher.partyId),
    } as Tt_UpsertSubjectGroup;
    await upsertGroup(transformedData);
    handleClose();
  };

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
          <Stack gap={2} p={2} sx={{ py: 2 }}>
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('timetable:groupType')}
              options={[
                SubjectGroupType.SubjectGroup,
                SubjectGroupType.SupportGroup,
              ].map((option) => ({
                value: option,
                label: t(`groups:subjectGroupType.${option}`),
              }))}
              controlProps={{
                name: 'groupType',
                control,
              }}
            />
          </Stack>
          <Stack gap={2} pt={2}>
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

          <Stack gap={2} p={2} sx={{ py: 2 }}>
            <RHFRadioGroup
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              label={t('timetable:studentMembershipType')}
              options={[
                TtGroupStudentMembershipTypeEnum.Core,
                TtGroupStudentMembershipTypeEnum.Block,
                TtGroupStudentMembershipTypeEnum.Freeform,
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

          {TtGroupStudentMembershipTypeEnum.Block === membershipTypeWatch && (
            <Stack gap={2} pt={2}>
              <RHFBlocksSelectAutocomplete
                controlProps={{
                  name: 'block',
                  control,
                }}
              />
            </Stack>
          )}
          {TtGroupStudentMembershipTypeEnum.Core === membershipTypeWatch && (
            <Stack gap={2} pt={2}>
              <RHFClassGroupAutocomplete
                controlProps={{
                  name: 'classGroup',
                  control,
                }}
              />
            </Stack>
          )}
          <Stack gap={2} pt={2}>
            <RHFStaffAutocomplete
              multiple
              controlProps={{
                name: 'teachers',

                control,
              }}
            />
          </Stack>
          <Stack gap={2} pt={2}>
            <RHFSubjectAutocomplete
              controlProps={{
                name: 'subject',

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
