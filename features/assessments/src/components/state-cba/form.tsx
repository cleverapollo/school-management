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
  AssessmentType,
  UseQueryReturnType,
  SubjectGroupType,
  Subject,
  SubjectGroup,
  StateCbaType,
} from '@tyro/api';
import { Card, Stack, CardHeader } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useMemo } from 'react';
import {
  FormCustomFieldsValues,
  CustomFieldsTable,
} from '../term-assessment/custom-fields-table';
import {
  useSubjectGroupsQuery,
  useSubjectsListQuery,
} from '../../api/state-cba/subject-groups';
import { useSaveStateCba } from '../../api/state-cba/save-state-cba';

export type YearGroupOption = UseQueryReturnType<typeof useYearGroups>[number];

export interface FormValues extends FormCustomFieldsValues {
  cbaType: StateCbaType;
  id?: number;
  name: string;
  assessmentType: AssessmentType;
  years: YearGroupOption;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  subject: Subject;
  groups: SubjectGroup[] | undefined;
}

type StateCbaFormProps = {
  stateCba?: FormValues;
  title: string;
  ctaText: string;
  onSuccess: () => void;
  onError: () => void;
};

const stateCBATypeOptions = [StateCbaType.Cba_1, StateCbaType.Cba_2];

export function StateCbaForm({
  stateCba,
  title,
  ctaText,
  onSuccess,
  onError,
}: StateCbaFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['assessments', 'common']);
  const { academicNamespaceId } = useParams();
  const academicNamespaceIdAsNumber = useNumber(academicNamespaceId);

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
    // mode: 'onChange',
  });

  const [subjectPicked, yearPicked] = watch(['subject', 'years']);

  const { data: yearGroupsData = [] } = useYearGroups({});
  const { data: subjectGroups } = useSubjectGroupsQuery({
    type: [SubjectGroupType.SubjectGroup],
  });
  const { data: subjects = [] } = useSubjectsListQuery({
    type: [SubjectGroupType.SubjectGroup],
  });
  const { mutate: saveStateCba, isLoading } = useSaveStateCba(
    academicNamespaceIdAsNumber
  );

  const filterSubjectGroupsBySubjectAndYear = (
    subjectName: string,
    yearGroup: YearGroupOption
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
    return filterSubjectGroupsBySubjectAndYear(subjectName, yearName);
  }, [subjectPicked, yearPicked]);

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  const onSubmit = ({
    cbaType,
    years,
    startDate,
    endDate,
    subject,
    groups,
    ...restData
  }: FormValues) => {
    const groupIds = groups?.map((group) => group?.partyId);
    if (stateCba?.id && stateCba?.id) {
      saveStateCba(
        {
          ...restData,
          id: stateCba?.id,
          yearId: years?.yearGroupId,
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
          onError,
        }
      );
    } else {
      saveStateCba(
        {
          ...restData,
          yearId: years?.yearGroupId,
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
          onError,
        }
      );
    }
  };

  const isEditing = !!(stateCba?.id && stateCba?.id);

  useEffect(() => {
    if (!stateCba?.id && subjectPicked && yearPicked) {
      // @ts-ignore
      setValue('groups', undefined);
    }
    const subjectChanged = stateCba?.subject?.name !== subjectPicked?.name;
    if (stateCba && stateCba?.id && subjectChanged) {
      // @ts-ignore
      setValue('groups', []);
    }
  }, [subjectPicked, yearPicked]);

  return (
    <Card variant="outlined" component="form" onSubmit={handleSubmit(onSubmit)}>
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
    </Card>
  );
}
