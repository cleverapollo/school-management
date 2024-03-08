import {
  RHFAutocomplete,
  RHFRadioGroup,
  RHFSwitch,
  useFormValidator,
  usePreferredNameLayout,
  useToast,
} from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import { PageOrientation } from '@tyro/api';
import { Box, FormLabel, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import React, { useMemo, useState } from 'react';
import {
  getPrintAssessment,
  ReturnTypeFromUseAssessments,
  useYearGroupEnrollments,
} from '@tyro/assessments';
import { PartyAutocompleteValue } from './types';

export interface PrintAssessmentFormProps {
  assessment?: ReturnTypeFromUseAssessments;
  academicNameSpaceId: number | null;
}

export type PrintAssessmentFormState = {
  orientation: PageOrientation;
  yearGroups: PartyAutocompleteValue[];
  classGroups: PartyAutocompleteValue[];
  students: PartyAutocompleteValue[];
  includeLevel: boolean;
  includeGrade: boolean;
  includeResult: boolean;
  includeTeacherComment: boolean;
  includeExtraFields: boolean;
  includeTutorComment: boolean;
  includeYearHeadComment: boolean;
  includePrincipalComment: boolean;
  includeAbsenceCount: boolean;
  includeLateCount: boolean;
  includeCAOPoints: boolean;
  printColour: boolean;
};

export default function PrintAssessmentForm({
  assessment,
  academicNameSpaceId,
}: PrintAssessmentFormProps) {
  const { t } = useTranslation(['common', 'printing']);
  const { resolver, rules } = useFormValidator<PrintAssessmentFormState>();
  const { displayName } = usePreferredNameLayout();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, setValue } =
    useForm<PrintAssessmentFormState>({
      resolver: resolver({
        orientation: rules.required(),
        includeLevel: rules.required(),
        includeGrade: rules.required(),
        includeResult: rules.required(),
        includeTeacherComment: rules.required(),
        includeExtraFields: rules.required(),
        includeTutorComment: rules.required(),
        includeYearHeadComment: rules.required(),
        includePrincipalComment: rules.required(),
        includeAbsenceCount: rules.required(),
        includeLateCount: rules.required(),
        includeCAOPoints: rules.required(),
        printColour: rules.required(),
      }),
      defaultValues: {
        orientation: PageOrientation.Portrait,
        includeLevel: true,
        includeGrade: true,
        includeResult: true,
        includeTeacherComment: true,
        includeExtraFields: true,
        includeTutorComment: true,
        includeYearHeadComment: true,
        includePrincipalComment: true,
        includeAbsenceCount: false,
        includeLateCount: false,
        includeCAOPoints: false,
        printColour: true,
      },
    });

  const [selectedYearGroups = [], selectedClassGroups = []] = watch([
    'yearGroups',
    'classGroups',
  ]);

  const { data: yearGroupEnrollments } = useYearGroupEnrollments(
    {
      yearGroupIds: selectedYearGroups.map((yearGroup) => yearGroup.partyId),
      academicNamespaceIds: [academicNameSpaceId ?? 0],
    },
    selectedYearGroups?.length > 0
  );

  const yearGroupOptions = useMemo(
    () =>
      assessment?.years
        ?.map(({ yearGroupId, name }) => ({ partyId: yearGroupId, name }))
        .sort((a, b) =>
          a.name.localeCompare(b?.name)
        ) as PartyAutocompleteValue[],
    [assessment?.years]
  );

  const classGroupOptions = useMemo(() => {
    const list: PartyAutocompleteValue[] = [];

    yearGroupEnrollments?.forEach(({ students }) => {
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
  }, [yearGroupEnrollments]);

  const studentOptions = useMemo(() => {
    const list: PartyAutocompleteValue[] = [];

    yearGroupEnrollments?.forEach(({ students }) => {
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
  }, [yearGroupEnrollments, selectedClassGroups]);

  const updateClassGroupValue = () => {
    setValue('classGroups', [], { shouldDirty: true });
  };

  const updateStudentValue = () => {
    setValue('students', [], { shouldDirty: true });
  };

  const onSubmit = async (data: PrintAssessmentFormState) => {
    const { yearGroups, classGroups, students, ...rest } = data;

    try {
      setIsLoading(true);
      const printResponse = await getPrintAssessment({
        assessmentId: assessment?.id ?? 0,
        yearGroupIds: yearGroupEnrollments?.map(({ partyId }) => partyId) ?? [],
        classGroupIds: classGroups.map(({ partyId }) => partyId),
        studentIds: students.map(({ partyId }) => partyId),
        includeGrade: true,
        includeLevel: true,
        includeResult: true,
        includeTeacherComment: true,
        includeExtraFields: true,
        includeTutorComment: true,
        includeYearHeadComment: true,
        includePrincipalComment: true,
        includeAbsenceCount: false,
        includeLateCount: false,
        includeCAOPoints: false,
        printColour: true,
        orientation: PageOrientation.Portrait,
      });

      if (printResponse?.print_assessment?.url) {
        window.open(printResponse.print_assessment.url, '_blank', 'noreferrer');
      }
    } catch {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3} sx={{ pt: 1 }}>
        <Stack gap={3} direction={{ sm: 'column', md: 'row' }}>
          <RHFAutocomplete
            fullWidth
            label={t('printing:assessment.yearGroup')}
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
            fullWidth
            label={t('printing:assessment.classGroup')}
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
            fullWidth
            label={t('printing:assessment.student')}
            optionIdKey="partyId"
            optionTextKey="name"
            multiple
            controlProps={{ name: 'students', control }}
            options={studentOptions ?? []}
          />
        </Stack>
        <Stack direction="row" gap={3}>
          <Grid container spacing={2} direction="row" sx={{ py: 4 }}>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeLevel')}
                controlProps={{ name: 'includeLevel', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeGrade')}
                controlProps={{ name: 'includeGrade', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeResult')}
                controlProps={{ name: 'includeResult', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeTeacherComment')}
                controlProps={{ name: 'includeTeacherComment', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeTeacherComment')}
                controlProps={{ name: 'includeTeacherComment', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeExtraFields')}
                controlProps={{ name: 'includeExtraFields', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeTutorComment')}
                controlProps={{ name: 'includeTutorComment', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeYearHeadComment')}
                controlProps={{ name: 'includeYearHeadComment', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includePrincipalComment')}
                controlProps={{ name: 'includeYearHeadComment', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeAbsenceCount')}
                controlProps={{ name: 'includeAbsenceCount', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeLateCount')}
                controlProps={{ name: 'includeLateCount', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.includeCAOPoints')}
                controlProps={{ name: 'includeCAOPoints', control }}
              />
            </Grid>
            <Grid item>
              <RHFSwitch
                label={t('printing:assessment.printColour')}
                controlProps={{ name: 'printColour', control }}
              />
            </Grid>
          </Grid>
          <Stack direction="row" gap={3} alignItems="center">
            <FormLabel>{t('printing:assessment.pageOrientation')}</FormLabel>
            <RHFRadioGroup
              disabled={isLoading}
              radioGroupProps={{ sx: { flexDirection: 'row' } }}
              options={[
                PageOrientation.Portrait,
                PageOrientation.Landscape,
              ].map((option) => ({
                value: option,
                label: t(`printing:assessment.printDirection.${option}`),
              }))}
              controlProps={{
                name: 'orientation',
                control,
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      <Box display="flex" justifyContent="flex-end" pt={3}>
        <LoadingButton variant="contained" type="submit" loading={isLoading}>
          {t('common:actions.print')}
        </LoadingButton>
      </Box>
    </form>
  );
}
