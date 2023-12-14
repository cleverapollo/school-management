import { useTranslation } from '@tyro/i18n';
import { Button, Stack, FormLabel } from '@mui/material';
import {
  useFormValidator,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFAutocomplete,
  RHFRadioGroup,
  RHFCheckbox,
  usePreferredNameLayout,
  useToast,
} from '@tyro/core';
import { Print_Orientation } from '@tyro/api';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useMemo, useState } from 'react';
import { ReturnTypeFromUseAssessments } from '../../api/assessments';
import { getPrintAssessment } from '../../api/print-assessment';

type AutocompleteValue = {
  partyId: number;
  name: string;
};

export type PrintAssessmentFormState = {
  printOrientation: Print_Orientation;
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
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<PrintAssessmentFormState>({
      resolver: resolver({
        printOrientation: rules.required(),
        showAttendance: rules.required(),
        showExtraFields: rules.required(),
      }),
      defaultValues: {
        printOrientation: Print_Orientation.Vertical,
        showAttendance: false,
        showExtraFields: false,
      },
    });

  const selectedYearGroups = watch('yearGroups') ?? [];
  const selectedClassGroups = watch('classGroups') ?? [];

  const selectedYearsData = useMemo(
    () =>
      assessment?.yearGroupEnrolments?.filter(({ partyId }) =>
        selectedYearGroups?.find((group) => group?.partyId === partyId)
      ),
    [assessment, selectedYearGroups]
  );

  const yearGroupOptions = useMemo(
    () =>
      assessment?.yearGroupEnrolments
        ?.map(({ partyId, name }) => ({ partyId, name }))
        .sort((a, b) => a.name.localeCompare(b?.name)) as AutocompleteValue[],
    [assessment?.yearGroupEnrolments]
  );

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

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async (data: PrintAssessmentFormState) => {
    const { yearGroups, classGroups, students, ...rest } = data;

    try {
      setIsLoading(true);
      const printResponse = await getPrintAssessment({
        assessmentId: assessment?.id,
        yearGroupEnrollmentIds: yearGroups.map(({ partyId }) => partyId),
        classGroupIds: classGroups.map(({ partyId }) => partyId),
        studentIds: students.map(({ partyId }) => partyId),
        ...rest,
      });

      if (printResponse?.print_assessment?.url) {
        handleClose();
        window.open(printResponse.print_assessment.url, '_blank', 'noreferrer');
      }
    } catch {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
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
              options={yearGroupOptions ?? []}
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
            <Stack direction="row" gap={3} alignItems="center">
              <FormLabel>{t('assessments:pageOrientation')}</FormLabel>
              <RHFRadioGroup
                disabled={isLoading}
                radioGroupProps={{ sx: { flexDirection: 'row' } }}
                options={[
                  Print_Orientation.Vertical,
                  Print_Orientation.Horizontal,
                ].map((option) => ({
                  value: option,
                  label: t(`assessments:printDirection.${option}`),
                }))}
                controlProps={{
                  name: 'printOrientation',
                  control,
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" autoFocus onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isLoading}>
            {t('common:actions.print')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
