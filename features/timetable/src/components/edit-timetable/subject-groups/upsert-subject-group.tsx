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
  SubjectGroup,
  SubjectGroupType, SubjectUsage,
  Tt_UpsertSubjectGroup,
  TtGroupStudentMembershipTypeEnum,
} from '@tyro/api';
import { useForm } from 'react-hook-form';
import {
  RHFStaffAutocomplete,
  StaffSelectOption,
  useStaffForSelect,
} from '@tyro/people';
import {
  ClassGroupSelect,
  CoreBlockOptions,
  RHFBlocksSelectAutocomplete,
  RHFClassGroupAutocomplete,
  useBlocksList,
} from '@tyro/groups';
import React, { useEffect, useMemo } from 'react';
import {
  CatalogueSubjectOption,
  RHFSubjectAutocomplete,
  useCatalogueSubjects,
} from '@tyro/settings';
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
  block: CoreBlockOptions | null;
  teachers: StaffSelectOption[] | null;
  subject: CatalogueSubjectOption | null;
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
  const { data: subjectsData } = useCatalogueSubjects({
    filterUsage: SubjectUsage.All,
  });
  const { data: staffData } = useStaffForSelect({});
  const { data: blocksData } = useBlocksList({});
  useEffect(() => {
    if (initialState?.partyGroup?.__typename === 'SubjectGroup') {
      const subjectGroup = initialState?.partyGroup as SubjectGroup;

      const existingTeachers =
        staffData?.filter((s) =>
          (
            initialState.teachers?.map((teacher) => teacher.partyId) ?? []
          ).includes(s.partyId)
        ) ?? null;
      const existingSubjects =
        subjectsData?.find((s) =>
          (subjectGroup.subjectIds ?? []).includes(s.id)
        ) ?? null;

      const existingBlock =
        blocksData?.find(
          (b) => b.blockId === subjectGroup.studentMembershipType?.blockId
        ) ?? null;
      const newValue = {
        name: subjectGroup.name,
        classGroup: null,
        membershipType: initialState.studentMembershipType,
        groupType: subjectGroup.subjectGroupType,
        block: existingBlock,
        teachers: existingTeachers,
        subject: existingSubjects,
      } as UpsertSubjectGroupFormState;
      reset(newValue);
    } else {
      reset(defaultState);
    }
  }, [initialState, subjectsData]);

  const isEdit = useMemo(
    () => initialState?.partyGroup?.__typename === 'SubjectGroup',
    [initialState]
  );
  const { control, handleSubmit, reset, watch } =
    useForm<UpsertSubjectGroupFormState>({
      resolver: resolver({
        name: rules.required(),
        membershipType: rules.required(),
        subject: rules.required(),
      }),
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
      subjectIds: [subject?.id],
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
      <DialogTitle onClose={onClose}>
        {t('timetable:createSubjectGroup')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={2} p={2} sx={{ py: 2 }}>
            <RHFRadioGroup
              disabled={isEdit}
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
              disabled={isEdit}
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
                disabled={isEdit}
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
                disabled={isEdit}
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
              label={t('timetable:teachers')}
              disabled={isEdit}
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
