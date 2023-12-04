import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Subject,
  SubjectGroup,
  StateCbaType,
} from '@tyro/api';
import {
  Card,
  Stack,
  CardHeader,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Link, useNavigate } from 'react-router-dom';

import { useSubjectGroups } from '@tyro/groups';
import {
  FormCustomFieldsValues,
  CustomFieldsTable,
} from '../term-assessment/custom-fields-table';
import {
  BackendErrorResponse,
  ParsedErrorDetail,
  useSaveStateCba,
} from '../../api/state-cba/save-state-cba';
import { useAssessmentSubjectGroups } from '../../api/assessment-subject-groups';

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
  const { data: subjectGroups } = useSubjectGroups();
  const { data: assessmentSubjectGroupsData = [] } = useAssessmentSubjectGroups(
    academicNamespaceIdAsNumber,
    {
      assessmentId: stateCba?.id,
    },
    !!stateCba?.id
  );

  const subjects = useMemo(() => {
    const subjectsFlattened = subjectGroups?.flatMap(
      (subjectGroup) => subjectGroup?.subjects?.[0]
    );

    const subjectList = subjectsFlattened?.reduce<FormattedSubjectsType>(
      (accumulator, current) => {
        if (
          current &&
          !accumulator.some((item) => item.name === current.name)
        ) {
          accumulator.push(current);
        }
        return accumulator;
      },
      []
    );
    return subjectList || [];
  }, [subjectGroups]);
  const disabledSubjectGroupIds = useMemo(
    () =>
      assessmentSubjectGroupsData
        .filter(
          ({ resultsEntered, extraFieldResultsEntered }) =>
            resultsEntered > 0 || extraFieldResultsEntered > 0
        )
        .map(({ subjectGroup }) => subjectGroup.partyId),
    [assessmentSubjectGroupsData]
  );

  const { mutateAsync: saveStateCba, isLoading } = useSaveStateCba(
    academicNamespaceIdAsNumber
  );

  const filterSubjectGroupsBySubjectAndYear = useCallback(
    (yearGroup: YearGroupOption, subjectName?: string | null) =>
      subjectGroups?.filter(
        (item) =>
          item.subjects.some((subject) => subject.name === subjectName) &&
          item.yearGroups.some((year) => year.name === yearGroup?.name)
      ) || [],
    [subjectGroups]
  );

  const subjectGroupOptions = useMemo(() => {
    const subjectName = subjectPicked?.name;
    const yearName: YearGroupOption = yearPicked;
    return filterSubjectGroupsBySubjectAndYear(yearName, subjectName);
  }, [subjectPicked, yearPicked, filterSubjectGroupsBySubjectAndYear]);

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  const onSubmit = handleSubmit(
    ({
      cbaType,
      years,
      startDate,
      endDate,
      subject,
      groups,
      extraFields,
      ...restData
    }) => {
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
          extraFields: extraFields.map(
            ({ commentBank: fieldCommentBank, ...field }) => ({
              ...field,
              commentBankId: fieldCommentBank?.id,
            })
          ),
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

  const isEditing = !!stateCba?.id;

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
              getOptionDisabled={(option) =>
                disabledSubjectGroupIds.includes(option.partyId)
              }
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const disabledOption = disabledSubjectGroupIds.includes(
                    option.partyId
                  );
                  const tagProps = getTagProps({ index });

                  return (
                    <Tooltip
                      key={tagProps.key}
                      title={
                        disabledOption
                          ? t(
                              'assessments:thereAreResultsRemoveBeforeRemovingSubjectGroup'
                            )
                          : undefined
                      }
                    >
                      <span>
                        <Chip
                          label={option.name}
                          {...tagProps}
                          disabled={disabledOption}
                        />
                      </span>
                    </Tooltip>
                  );
                })
              }
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
              {t('common:actions.save')}
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
