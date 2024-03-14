import {
  LoadingPlaceholderContainer,
  RHFAutocomplete,
  RHFCheckboxGroup,
  RHFRadioGroup,
  usePreferredNameLayout,
} from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import { PageOrientation, Print_AssessmentOptions } from '@tyro/api';
import { Card, Stack, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useEffect, useMemo, useState } from 'react';
import { ReturnTypeFromUseAssessments } from '@tyro/assessments';
import { useYearGroupEnrollments } from '@tyro/groups';
import { PartyAutocompleteValue } from './types';
import {
  PrintAssessmentOptions,
  getPrintAssessment,
  usePrintAssessment,
} from '../../api/print-assessment';

export interface PrintAssessmentFormProps {
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
  assessment: ReturnTypeFromUseAssessments | undefined;
  orientation: PageOrientation;
  yearGroups: PartyAutocompleteValue[];
  classGroups: PartyAutocompleteValue[];
  students: PartyAutocompleteValue[];
  colorSetting: 'COLOR' | 'BLACK_AND_WHITE';
  showCommentsFrom: (typeof availableCommentTypes)[number][];
  includeOtherInfo: (typeof otherInfoToShow)[number][];
};

export const defaultValues = {
  orientation: PageOrientation.Portrait,
  colorSetting: 'COLOR',
  showCommentsFrom: [
    'Teacher',
    'Tutor',
    'YearHead',
    'Principal',
  ] as PrintAssessmentFormState['showCommentsFrom'],
  includeOtherInfo: [
    'Level',
    'Grade',
    'Result',
    'ExtraFields',
  ] as PrintAssessmentFormState['includeOtherInfo'],
} as const;

export function PrintAssessmentForm({
  academicNameSpaceId,
}: PrintAssessmentFormProps) {
  const { t } = useTranslation(['common', 'printing']);

  const { displayName } = usePreferredNameLayout();
  const [filter, setFilter] = useState<PrintAssessmentOptions | null>(null);
  const { control, handleSubmit, watch, setValue, getValues } =
    useFormContext<PrintAssessmentFormState>();

  const [assessment, selectedYearGroups = [], selectedClassGroups = []] = watch(
    ['assessment', 'yearGroups', 'classGroups']
  );

  const { data: assessmentData, isFetching } = usePrintAssessment(filter);
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

  const getAssessmentOptions = ({
    orientation,
    yearGroups,
    classGroups,
    students,
    colorSetting,
    showCommentsFrom,
    includeOtherInfo,
  }: PrintAssessmentFormState): PrintAssessmentOptions => ({
    academicNameSpaceId: academicNameSpaceId ?? 0,
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

  const onView = handleSubmit((formState) => {
    const assessmentOptions = getAssessmentOptions(formState);
    setFilter(assessmentOptions);
  });

  const handlePrint = handleSubmit(async (formState) => {
    const assessmentOptions = getAssessmentOptions(formState);
    const printResponse = await getPrintAssessment(assessmentOptions);

    if (printResponse?.print_assessment?.url)
      window.open(printResponse.print_assessment.url, '_blank', 'noreferrer');
  });

  useEffect(() => {
    const yearGroupOptionIds = yearGroupOptions?.map(({ partyId }) => partyId);
    const { yearGroups = [] } = getValues();
    const filteredYearsGroups = yearGroups.filter(
      (yearGroup) => yearGroupOptionIds?.includes(yearGroup.partyId) ?? false
    );

    if (filteredYearsGroups.length !== yearGroups.length) {
      setValue('yearGroups', filteredYearsGroups);
    }
  }, [yearGroupOptions]);

  useEffect(() => {
    const classGroupOptionIds = classGroupOptions?.map(
      ({ partyId }) => partyId
    );
    const { classGroups = [] } = getValues();
    const filteredClassGroups = classGroups.filter(
      (classGroup) => classGroupOptionIds?.includes(classGroup.partyId) ?? false
    );

    if (filteredClassGroups.length !== classGroups.length) {
      setValue('classGroups', filteredClassGroups);
    }
  }, [classGroupOptions]);

  useEffect(() => {
    const studentOptionIds = studentOptions?.map(({ partyId }) => partyId);
    const { students = [] } = getValues();
    const filteredStudents = students.filter(
      (student) => studentOptionIds?.includes(student.partyId) ?? false
    );

    if (filteredStudents.length !== students.length) {
      setValue('students', filteredStudents);
    }
  }, [studentOptions]);

  return (
    <Stack spacing={2} pt={2}>
      <form onSubmit={onView}>
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
                />
                <RHFAutocomplete
                  fullWidth
                  label={t('printing:assessment.classGroup')}
                  optionIdKey="partyId"
                  optionTextKey="name"
                  multiple
                  controlProps={{ name: 'classGroups', control }}
                  options={classGroupOptions ?? []}
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
                label={t('printing:includeAdditionalInformation')}
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
                  disabled={isFetching}
                  options={[
                    PageOrientation.Portrait,
                    PageOrientation.Landscape,
                  ].map((option) => ({
                    value: option,
                    label: t(
                      `printing:printSettings.pageOrientation.${option}`
                    ),
                  }))}
                  controlProps={{
                    name: 'orientation',
                    control,
                  }}
                />
                <RHFRadioGroup
                  label={t('printing:printSettings.colourSettings.title')}
                  disabled={isFetching}
                  options={(['COLOR', 'BLACK_AND_WHITE'] as const).map(
                    (option) => ({
                      value: option,
                      label: t(
                        `printing:printSettings.colourSettings.${option}`
                      ),
                    })
                  )}
                  controlProps={{
                    name: 'colorSetting',
                    control,
                  }}
                />
              </Stack>
            </Card>
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="soft"
                type="submit"
                loading={isFetching}
                sx={{ flex: 1 }}
              >
                {t('common:actions.view')}
              </LoadingButton>
              <LoadingButton
                variant="contained"
                loading={isFetching}
                onClick={handlePrint}
                sx={{ flex: 1 }}
              >
                {t('common:actions.print')}
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </form>
      <Card>
        <Stack
          style={{
            maxHeight: '100%',
            overflow: 'auto',
            padding: '16px',
            paddingTop: '8px',
            minHeight: '180px',
          }}
        >
          {assessmentData?.html ? (
            <div
              style={{ maxHeight: '100%', overflow: 'auto' }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: assessmentData.html }}
            />
          ) : (
            <LoadingPlaceholderContainer isLoading={isFetching}>
              <Stack
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h2" component="span">
                  ⚙️
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  color="text.secondary"
                >
                  {t('printing:pleaseSelectPrintSettings')}
                </Typography>
              </Stack>
            </LoadingPlaceholderContainer>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
