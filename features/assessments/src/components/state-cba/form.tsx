import { useCallback, useEffect, useMemo } from 'react';
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
  ParsedErrorDetail,
  BackendErrorResponse,
} from '@tyro/api';
import { Button, Card, CardHeader, Chip, Stack, Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

import { useSubjectGroups } from '@tyro/groups';
import {
  FormCustomFieldsValues,
  CustomFieldsTable,
} from '../term-assessment/custom-fields-table';
import { useSaveStateCba } from '../../api/state-cba/save-state-cba';
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
  onErrorModalOpen?: () => void;
  setErrorResponse?: React.Dispatch<React.SetStateAction<string | null>>;
};

const stateCBATypeOptions = [StateCbaType.Cba_1, StateCbaType.Cba_2];

export function StateCbaForm({
  stateCba,
  title,
  onSuccess,
  onError,
  onErrorModalOpen,
  setErrorResponse,
}: StateCbaFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['assessments', 'common']);
  const { activeAcademicNamespace } = useAcademicNamespace();
  const academicNamespaceIdAsNumber =
    useNumber(activeAcademicNamespace?.academicNamespaceId) ?? 0;

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

  const { subjects, subjectsMapById } = useMemo(() => {
    const subjectsFlattened = subjectGroups?.flatMap(
      (subjectGroup) => subjectGroup?.subjects?.[0]
    );

    const subjectsMap = subjectsFlattened?.reduce((acc, current) => {
      acc.set(current?.id, current);
      return acc;
    }, new Map<number, NonNullable<typeof subjectsFlattened>[number]>());

    const subjectsList = Array.from(subjectsMap?.values() ?? []);
    return {
      subjects:
        subjectsList
          ?.filter((subject) => subject !== undefined)
          .sort((a, b) => Number(a.nationalCode) - Number(b.nationalCode)) ||
        [],
      subjectsMapById: subjectsMap,
    };
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
    (yearGroup: YearGroupOption, subjectId?: number | null) =>
      subjectGroups
        ?.filter(
          (item) =>
            item.subjects.some((subject) => subject.id === subjectId) &&
            item.yearGroups.some((year) => year.name === yearGroup?.name)
        )
        .sort((a, b) => a.name.localeCompare(b?.name)) || [],
    [subjectGroups]
  );

  const subjectGroupOptions = useMemo(() => {
    const subjectId = subjectPicked?.id;
    const yearName: YearGroupOption = yearPicked;
    return filterSubjectGroupsBySubjectAndYear(yearName, subjectId);
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
              } catch (parseError) {
                console.error(parseError);
              }
            }
            const regex = /: ([0-9]+)/g;
            const responseFormatted = regex.exec(errorMessage);
            if (responseFormatted && onErrorModalOpen) {
              if (setErrorResponse) {
                setErrorResponse(responseFormatted[1]);
              }
              onErrorModalOpen();
            }
          },
        }
      );
    }
  );

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
      <CardHeader component="h2" title={title} />

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
            label={t('assessments:labels.year', { count: 1 })}
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
            optionIdKey="id"
            getOptionLabel={(option) => {
              const subject = subjectsMapById?.get(option?.id);
              return subject?.nationalCode
                ? `${subject.name} (${subject.nationalCode})`
                : option?.name ?? '';
            }}
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
                  option?.partyId
                );

                return (
                  <Tooltip
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
                        {...getTagProps({ index })}
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
        <Stack flexDirection="row" justifyContent="flex-end">
          <Button
            size="large"
            variant="soft"
            color="inherit"
            onClick={() => navigate('/assessments')}
          >
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            size="large"
            type="submit"
            loading={isLoading}
            sx={{ ml: 2 }}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );
}
