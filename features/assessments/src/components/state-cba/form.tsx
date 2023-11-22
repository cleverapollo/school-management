import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSelect,
  useFormValidator,
  useNumber,
} from '@tyro/core';
import {
  useYearGroups,
  useAcademicNamespace,
  AssessmentType,
  SubjectGroupType,
  Subject,
  SubjectGroup,
  StateCbaType,
} from '@tyro/api';
import { Card, Stack, CardHeader, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Link, useNavigate } from 'react-router-dom';

import { useSubjectGroupsCbaQuery } from '@tyro/groups';
import {
  FormCustomFieldsValues,
  CustomFieldsTable,
} from '../term-assessment/custom-fields-table';
import {
  BackendErrorResponse,
  ParsedErrorDetail,
  useSaveStateCba,
} from '../../api/state-cba/save-state-cba';

export type YearGroupOption = {
  name: string;
  yearGroupId: number;
};

export interface FormValues extends FormCustomFieldsValues {
  cbaType: StateCbaType | null;
  id?: number;
  name: string;
  assessmentType: AssessmentType;
  years: YearGroupOption;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  subject: Pick<Subject, 'id' | 'colour' | 'name'> | null;
  groups: Pick<SubjectGroup, 'partyId' | 'name'>[] | null | undefined;
}

type StateCbaFormProps = {
  stateCba?: FormValues;
  title: string;
  ctaText: string;
  onSuccess: () => void;
  onError: () => void;
};

const stateCBATypeOptions = [StateCbaType.Cba_1, StateCbaType.Cba_2];
type FormattedSubjectsType = {
  name: string;
  id: number;
}[];

export function StateCbaForm({
  stateCba,
  title,
  ctaText,
  onSuccess,
  onError,
}: StateCbaFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['assessments', 'common']);
  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicNamespaceIdAsNumber =
    useNumber(activeAcademicNamespace?.academicNamespaceId) ?? 0;
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [errorResponseOne, setErrorResponseOne] = useState<string | null>(null);

  const { resolver, rules } = useFormValidator<FormValues>();

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: stateCba,
    resolver: resolver({
      years: rules.required(),
      startDate: [rules.required(), rules.date()],
      endDate: [
        rules.required(),
        rules.date(),
        rules.afterStartDate('startDate'),
      ],
      subject: rules.required(),
      groups: rules.required(),
    }),
    mode: 'onChange',
  });

  const [subjectPicked, yearPicked] = watch(['subject', 'years']);

  const { data: yearGroupsData = [] } = useYearGroups({});

  const { data: subjectGroups } = useSubjectGroupsCbaQuery({
    type: [SubjectGroupType.SubjectGroup],
  });

  const subjects = useMemo(() => {
    const subjectsFlattened = subjectGroups?.flatMap(
      (subject) => subject?.subjects[0]
    );

    const subjectList = subjectsFlattened?.reduce<FormattedSubjectsType>(
      (accumulator, current) => {
        if (!accumulator.some((item) => item.name === current.name)) {
          accumulator.push(current);
        }
        return accumulator;
      },
      []
    );
    return subjectList || [];
  }, [subjectGroups]);

  const { mutateAsync: saveStateCba, isLoading } = useSaveStateCba(
    academicNamespaceIdAsNumber
  );

  const filterSubjectGroupsBySubjectAndYear = (
    yearGroup: YearGroupOption,
    subjectName?: string | null
  ) =>
    subjectGroups
      ?.filter((item) =>
        item.subjects.some((subject) => subject.name === subjectName)
      )
      ?.filter((years) =>
        years.yearGroups.some((year) => year.name === yearGroup?.name)
      ) || [];

  const subjectGroupOptions = useMemo(() => {
    const subjectName = subjectPicked?.name;
    const yearName: YearGroupOption = yearPicked;
    return filterSubjectGroupsBySubjectAndYear(yearName, subjectName);
  }, [subjectPicked, yearPicked]);

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  const onSubmit = handleSubmit(
    ({ cbaType, years, startDate, endDate, subject, groups, ...restData }) => {
      const groupIds = groups?.map((group) => group?.partyId);
      saveStateCba(
        {
          ...restData,
          id: stateCba?.id ?? null,
          yearId: years?.yearGroupId ?? 0,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          stateCbaType: cbaType,
          subjectGroupIds: groupIds,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            navigate('/assessments');
          },
          onError: (error: unknown) => {
            let errorMessage = t('assessments:existingCbaDefaultTitle');

            if (typeof error === 'object' && error !== null) {
              const backendError = error as BackendErrorResponse;
              try {
                const parsedError = JSON.parse(
                  backendError.response.error
                ) as ParsedErrorDetail;
                errorMessage = parsedError.detail || errorMessage;
                setErrorResponseOne(errorMessage);
              } catch (parseError) {
                console.error(parseError);
              }
            }
            const regex = /: ([0-9]+)/g;
            const responseFormatted = regex.exec(errorMessage);
            if (responseFormatted) {
              setErrorResponse(responseFormatted[1]);
            }
          },
        }
      );
    }
  );

  const errorTitleMessage = errorResponseOne?.replace(/\..*/, '');

  const isEditing = !!(stateCba?.id && stateCba?.id);

  useEffect(() => {
    if (!stateCba?.id && subjectPicked && yearPicked) {
      setValue('groups', undefined);
    }
    const subjectChanged = stateCba?.subject?.name !== subjectPicked?.name;
    if (stateCba?.id && subjectChanged) {
      setValue('groups', []);
    }
  }, [subjectPicked, yearPicked, stateCba]);

  return (
    <Card variant="outlined" component="form" onSubmit={onSubmit}>
      <CardHeader
        component="h2"
        title={!errorResponse ? title : errorTitleMessage}
      />
      {!errorResponse && (
        <Stack direction="column" gap={3} p={3}>
          <Stack direction="row" gap={2}>
            <RHFSelect
              disabled={isEditing}
              label={t('assessments:cbaType')}
              options={stateCBATypeOptions}
              getOptionLabel={(option) => t(`assessments:${option}`)}
              controlProps={{ name: 'cbaType', control }}
              sx={textFieldStyle}
            />
            <RHFAutocomplete
              disabled={isEditing}
              label={t('assessments:labels.years')}
              optionIdKey="yearGroupId"
              optionTextKey="name"
              controlProps={{ name: 'years', control }}
              sx={textFieldStyle}
              options={yearGroupsData}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <RHFDatePicker
              label={t('assessments:labels.startDate')}
              controlProps={{ name: 'startDate', control }}
              inputProps={{ sx: textFieldStyle }}
            />
            <RHFDatePicker
              label={t('assessments:labels.endDate')}
              controlProps={{ name: 'endDate', control }}
              inputProps={{ sx: textFieldStyle }}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <RHFAutocomplete
              disabled={isEditing}
              label={t('common:subject')}
              optionIdKey="name"
              optionTextKey="name"
              controlProps={{ name: 'subject', control }}
              sx={textFieldStyle}
              options={subjects}
            />
            <RHFAutocomplete
              label={t('common:subjectGroups')}
              optionIdKey="partyId"
              optionTextKey="name"
              multiple
              controlProps={{ name: 'groups', control }}
              sx={textFieldStyle}
              options={subjectGroupOptions}
            />
          </Stack>
          <CustomFieldsTable control={control} />
          <Stack alignItems="flex-end">
            <LoadingButton
              variant="contained"
              size="large"
              type="submit"
              loading={isLoading}
            >
              {ctaText}
            </LoadingButton>
          </Stack>
        </Stack>
      )}
      {errorResponse && (
        <Stack direction="column" gap={3} p={3}>
          <Typography variant="body1">
            {t('assessments:existingCbaErrorMessageText')}
          </Typography>
          <Typography
            component={Link}
            variant="body2"
            to={`/assessments/${academicNamespaceIdAsNumber}/state-cba-assessments/${errorResponse}`}
          >
            {t('assessments:viewExistingCba')}
          </Typography>
          <Typography
            component={Link}
            variant="body2"
            to={`/assessments/${academicNamespaceIdAsNumber}/state-cba-assessments/${errorResponse}/edit`}
          >
            {t('assessments:editExistingCba')}
          </Typography>
        </Stack>
      )}
    </Card>
  );
}
