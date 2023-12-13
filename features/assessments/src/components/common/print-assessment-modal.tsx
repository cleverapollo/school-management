import { useTranslation } from '@tyro/i18n';
import { Button, Stack } from '@mui/material';
import {
  useFormValidator,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  RHFCheckbox,
  usePreferredNameLayout,
} from '@tyro/core';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';
import { ReturnTypeFromUseAssessments } from '../../api/assessments';

type AutocompleteValue = {
  partyId: number;
  name: string;
};

export type PrintAssessmentFormState = {
  yearGroups: AutocompleteValue[];
  classGroups: AutocompleteValue[];
  students: AutocompleteValue[];
  showAttendance: boolean;
  showExtraFields: boolean;
};

export interface PrintAssessmentModalProps {
  data?: ReturnTypeFromUseAssessments;
  onClose: () => void;
}

export function PrintAssessmentModal({
  data: assessment,
  onClose,
}: PrintAssessmentModalProps) {
  const { t } = useTranslation(['common', 'assessments']);
  const { resolver, rules } = useFormValidator<PrintAssessmentFormState>();

  const { displayName } = usePreferredNameLayout();

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<PrintAssessmentFormState>({
      resolver: resolver({}),
      defaultValues: {
        yearGroups: [],
        classGroups: [],
        students: [],
      },
    });

  const selectedYearGroups = watch('yearGroups');
  const selectedClassGroups = watch('classGroups');
  const selectedStudents = watch('students');

  const onSubmit = (data: PrintAssessmentFormState) => {};

  const selectedYearsData = useMemo(
    () =>
      assessment?.yearGroupEnrolments?.filter(({ partyId }) =>
        selectedYearGroups?.find((group) => group?.partyId === partyId)
      ),
    [assessment, selectedYearGroups]
  );

  const yearGroupoptions = assessment?.yearGroupEnrolments
    ?.map(({ partyId, name }) => ({ partyId, name }))
    .sort((a, b) => a.name.localeCompare(b?.name)) as AutocompleteValue[];

  const classGroupOptions = useMemo(() => {
    const list: AutocompleteValue[] = [];

    selectedYearsData?.forEach(({ students }) => {
      students.forEach(({ classGroup }) => {
        if (
          !list.find((e) => e?.partyId === classGroup?.partyId) &&
          classGroup
        ) {
          list.push(classGroup);
        }
      });
    });

    return list.sort((a, b) => a.name.localeCompare(b?.name));
  }, [selectedYearsData]);

  const studentOptions = useMemo(() => {
    const list: AutocompleteValue[] = [];

    selectedYearsData?.forEach(({ students }) => {
      students.forEach(({ partyId, person, classGroup }) => {
        if (
          selectedClassGroups.find((e) => e.partyId === classGroup?.partyId)
        ) {
          list.push({
            partyId,
            name: displayName(person),
          });
        }
      });
    });

    return list.sort((a, b) => a.name.localeCompare(b?.name));
  }, [selectedYearsData, selectedClassGroups]);

  const updateClassGroupValue = () => {
    setValue('classGroups', [], { shouldDirty: true });
  };

  const updateStudentValue = () => {
    setValue('students', [], { shouldDirty: true });
  };

  return (
    <Dialog open={!!assessment} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('assessments:printAssessment')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={3} sx={{ pt: 1 }}>
            <RHFAutocomplete
              label={t('assessments:yearGroup')}
              optionIdKey="partyId"
              optionTextKey="name"
              multiple
              controlProps={{ name: 'yearGroups', control }}
              options={yearGroupoptions ?? []}
              onChange={(_, __, reason) => {
                if (reason === 'removeOption') {
                  updateClassGroupValue();
                  updateStudentValue();
                }
              }}
            />
            <RHFAutocomplete
              label={t('assessments:classGroup')}
              optionIdKey="partyId"
              optionTextKey="name"
              multiple
              controlProps={{ name: 'classGroups', control }}
              options={classGroupOptions ?? []}
              onChange={(_, __, reason) => {
                if (reason === 'removeOption') {
                  updateStudentValue();
                }
              }}
            />
            <RHFAutocomplete
              label={t('assessments:student')}
              optionIdKey="partyId"
              optionTextKey="name"
              multiple
              controlProps={{ name: 'students', control }}
              options={studentOptions ?? []}
            />
            <Stack direction="row" gap={2}>
              <RHFCheckbox
                label={t('assessments:showAttendance')}
                checkboxProps={{ color: 'primary' }}
                controlProps={{ name: 'showAttendance', control }}
              />
              <RHFCheckbox
                label={t('assessments:showExtraFields')}
                checkboxProps={{ color: 'primary' }}
                controlProps={{ name: 'showExtraFields', control }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" autoFocus onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            //  load ing={isSubmitting}
          >
            {t('common:actions.print')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
