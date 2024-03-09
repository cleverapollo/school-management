import {
  CheckboxGroup,
  RHFAutocomplete,
  RHFCheckboxGroup,
  RHFRadioGroup,
  RHFSwitch,
  useFormValidator,
  usePreferredNameLayout,
  useToast,
} from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import { PageOrientation, Print_AssessmentOptions } from '@tyro/api';
import { Box, Card, FormLabel, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useMemo, useState } from 'react';
import { ReturnTypeFromUseAssessments } from '@tyro/assessments';
import { useYearGroupEnrollments } from '@tyro/groups';
import { PartyAutocompleteValue } from './types';
import { getPrintAssessment } from '../../api/print-assessment';

export interface PrintAssessmentFormProps {
  assessment?: ReturnTypeFromUseAssessments;
  academicNameSpaceId: number | null;
}

const availableCommentTypes = [
  'Teacher',
  'Tutor',
  'YearHead',
  'Principal',
] as const;

const otherInfoToShow = [
  'Level',
  'Grade',
  'Result',
  'ExtraFields',
  'AbsenceCount',
  'LateCount',
  'CAOPoints',
] as const;

export type PrintAssessmentFormState = {
  orientation: PageOrientation;
  yearGroups: PartyAutocompleteValue[];
  classGroups: PartyAutocompleteValue[];
  students: PartyAutocompleteValue[];
  colorSetting: 'COLOR' | 'BLACK_AND_WHITE';
  showCommentsFrom: (typeof availableCommentTypes)[number][];
  includeOtherInfo: (typeof otherInfoToShow)[number][];
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
        colorSetting: rules.required(),
      }),
      defaultValues: {
        orientation: PageOrientation.Portrait,
        colorSetting: 'COLOR',
        showCommentsFrom: ['Teacher', 'Tutor', 'YearHead', 'Principal'],
        includeOtherInfo: ['Level', 'Grade', 'Result', 'ExtraFields'],
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

  const onSubmit = handleSubmit(
    async ({
      orientation,
      yearGroups,
      classGroups,
      students,
      colorSetting,
      showCommentsFrom,
      includeOtherInfo,
    }) => {
      try {
        setIsLoading(true);
        const printResponse = await getPrintAssessment({
          assessmentId: assessment?.id ?? 0,
          orientation,
          yearGroupIds: yearGroups?.map(({ partyId }) => partyId) ?? [],
          classGroupIds: classGroups.map(({ partyId }) => partyId),
          studentIds: students.map(({ partyId }) => partyId),
          printColour: colorSetting === 'COLOR',
          ...availableCommentTypes.reduce((acc, commentType) => {
            acc[`include${commentType}Comment`] =
              showCommentsFrom.includes(commentType);
            return acc;
          }, {} as Pick<Print_AssessmentOptions, 'includePrincipalComment' | 'includeTeacherComment' | 'includeTutorComment' | 'includeYearHeadComment'>),
          ...otherInfoToShow.reduce((acc, other) => {
            acc[`include${other}`] = includeOtherInfo.includes(other);
            return acc;
          }, {} as Pick<Print_AssessmentOptions, 'includeAbsenceCount' | 'includeCAOPoints' | 'includeExtraFields' | 'includeGrade' | 'includeLateCount' | 'includeLevel' | 'includeResult'>),
        });

        if (printResponse?.print_assessment?.url) {
          window.open(
            printResponse.print_assessment.url,
            '_blank',
            'noreferrer'
          );
        }
      } catch {
        toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  );

  return (
    <form onSubmit={onSubmit}>
      <Stack direction="row" spacing={2}>
        <Card sx={{ py: 1.5, px: 2.5, flex: 1 }}>
          <Typography variant="h6" sx={{ pb: 2 }}>
            {t('printing:selectInfoToPrint')}
          </Typography>
          <Stack direction="row" spacing={4}>
            <Stack spacing={2} flex={1} maxWidth={300}>
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
            <RHFCheckboxGroup
              label={t('printing:assessment.showCommentsFrom')}
              controlProps={{ name: 'showCommentsFrom', control }}
              options={[...availableCommentTypes]}
              getOptionLabel={(option) =>
                t(`printing:assessment.commentOptions.${option}`)
              }
            />
            <RHFCheckboxGroup
              label={t('printing:otherInfoToShow')}
              controlProps={{ name: 'includeOtherInfo', control }}
              options={[...otherInfoToShow]}
              getOptionLabel={(option) =>
                t(`printing:assessment.otherOptions.${option}`)
              }
            />
          </Stack>
        </Card>
        <Stack spacing={2}>
          <Card
            sx={{ py: 1.5, px: 2.5, backgroundColor: 'slate.100', flex: 1 }}
            variant="outlined"
          >
            <Typography variant="h6" sx={{ pb: 2 }}>
              {t('printing:printSettings.title')}
            </Typography>
            <Stack spacing={1}>
              <RHFRadioGroup
                label={t('printing:printSettings.pageOrientation.title')}
                disabled={isLoading}
                options={[
                  PageOrientation.Portrait,
                  PageOrientation.Landscape,
                ].map((option) => ({
                  value: option,
                  label: t(`printing:printSettings.pageOrientation.${option}`),
                }))}
                controlProps={{
                  name: 'orientation',
                  control,
                }}
              />
              <RHFRadioGroup
                label={t('printing:printSettings.colourSettings.title')}
                disabled={isLoading}
                options={(['COLOR', 'BLACK_AND_WHITE'] as const).map(
                  (option) => ({
                    value: option,
                    label: t(`printing:printSettings.colourSettings.${option}`),
                  })
                )}
                controlProps={{
                  name: 'colorSetting',
                  control,
                }}
              />
            </Stack>
          </Card>
          <LoadingButton variant="contained" type="submit" loading={isLoading}>
            {t('common:actions.print')}
          </LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
}
