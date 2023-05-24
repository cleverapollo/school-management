import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  useFormValidator,
} from '@tyro/core';

import {
  CommentType,
  useYearGroups,
  AssessmentType,
  GradeType,
  UseQueryReturnType,
} from '@tyro/api';
import { Card, Stack, CardHeader, Typography } from '@mui/material';
import { useForm, Path } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { CommentBankOption } from '../../api/comment-bank';
import { CommentBankOptions } from './comment-bank-options';
import { CommentLengthField } from './comment-length-field';
import {
  CustomFieldsTable,
  FormCustomFieldsValues,
} from './custom-fields-table';
import { useSaveTermAssessment } from '../../api/save-term-assessment';

type YearGroupOption = UseQueryReturnType<typeof useYearGroups>[number];

type CommentTypeOption = Exclude<CommentType, CommentType.None>;

const commentTypeOptions: CommentTypeOption[] = [
  CommentType.CommentBank,
  CommentType.FreeForm,
  CommentType.Both,
];

export interface FormValues extends FormCustomFieldsValues {
  id?: number;
  // Details
  name: string;
  years: YearGroupOption[];
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  // Grades
  captureTarget: boolean;
  // Comments
  includeTeacherComments: boolean;
  commentType?: CommentType;
  commentBank?: Partial<CommentBankOption>;
  commentLength?: number | null;
  captureTutorComment: boolean;
  captureYearHeadComment: boolean;
  captureHouseMasterComment: boolean;
  capturePrincipalComment: boolean;
}

type TermAssessmentFormProps = {
  termAssessment?: FormValues;
  title: string;
  ctaText: string;
  onSuccess: () => void;
  onError: () => void;
};

const COMMENT_LENGTH_MIN = 1;
const COMMENT_LENGTH_MAX = 1000;

export function TermAssessmentForm({
  termAssessment,
  title,
  ctaText,
  onSuccess,
  onError,
}: TermAssessmentFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['assessments']);

  const { data: yearGroupsData = [] } = useYearGroups({});

  const { resolver, rules } = useFormValidator<FormValues>();
  const { mutate: saveTermAssessment, isLoading } = useSaveTermAssessment();

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: termAssessment,
    resolver: resolver({
      name: rules.required(),
      years: rules.required(),
      startDate: [rules.required(), rules.date()],
      endDate: [
        rules.required(),
        rules.date(),
        rules.afterStartDate('startDate'),
      ],
      commentType: rules.required(),
      commentBank: rules.required(),
      commentLength: [
        rules.required(),
        rules.min(COMMENT_LENGTH_MIN),
        rules.max(COMMENT_LENGTH_MAX),
      ],
      extraFields: {
        name: rules.required(),
        extraFieldType: rules.required(),
        commentBank: rules.required(),
        commentLength: [
          rules.required(),
          rules.min(COMMENT_LENGTH_MIN),
          rules.max(COMMENT_LENGTH_MAX),
        ],
      },
    }),
  });

  const [showTeacherComments, commentTypeValue] = watch([
    'includeTeacherComments',
    'commentType',
  ]);

  const onSubmit = ({
    years,
    startDate,
    endDate,
    includeTeacherComments,
    commentBank,
    commentType,
    extraFields,
    id: assessmentId,
    commentLength,
    ...restData
  }: FormValues) => {
    saveTermAssessment(
      {
        ...restData,
        id: assessmentId,
        assessmentType: AssessmentType.Term,
        gradeType: GradeType.Both,
        years: years.flatMap((year) => (year ? [year.yearGroupId] : [])),
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        ...(includeTeacherComments
          ? {
              commentType: commentType ?? CommentType.None,
              commentBankId: commentBank?.id,
              commentLength,
            }
          : {
              commentType: CommentType.None,
              commentBankId: null,
              commentLength: null,
            }),
        extraFields: extraFields.map(
          ({ commentBank: fieldCommentBank, ...field }) => ({
            ...field,
            assessmentId,
            commentBankId: fieldCommentBank?.id,
          })
        ),
      },
      {
        onSuccess: () => {
          onSuccess?.();
          navigate('/assessments');
        },
        onError,
      }
    );
  };

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  return (
    <Card variant="outlined" component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardHeader
        component="h2"
        title={title}
        sx={{
          p: 3,
          pt: 2.25,
          pb: 1.25,
          m: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Stack direction="column" gap={3} p={3}>
        <Stack direction="column" gap={2.5}>
          <Typography variant="subtitle1" color="text.secondary">
            {t('assessments:details')}
          </Typography>
          <Stack direction="row" gap={2}>
            <RHFTextField<FormValues>
              label={t('assessments:labels.assessmentName')}
              textFieldProps={{ sx: textFieldStyle }}
              controlProps={{
                name: 'name',
                control,
              }}
            />
            <RHFAutocomplete<FormValues, YearGroupOption>
              label={t('assessments:labels.years')}
              optionIdKey="yearGroupId"
              optionTextKey="name"
              controlProps={{ name: 'years', control }}
              multiple
              sx={textFieldStyle}
              options={yearGroupsData}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <RHFDatePicker<FormValues>
              label={t('assessments:labels.startDate')}
              controlProps={{ name: 'startDate', control }}
              inputProps={{ sx: textFieldStyle }}
            />
            <RHFDatePicker<FormValues>
              label={t('assessments:labels.endDate')}
              controlProps={{ name: 'endDate', control }}
              inputProps={{ sx: textFieldStyle }}
            />
          </Stack>
        </Stack>
        <Stack direction="column" gap={2.5}>
          <Typography variant="subtitle1" color="text.secondary">
            {t('assessments:grades')}
          </Typography>
          <RHFSwitch<FormValues>
            label={t('assessments:labels.includeTargetGrades')}
            switchProps={{ color: 'success' }}
            controlProps={{ name: 'captureTarget', control }}
          />
        </Stack>
        <Stack direction="column" gap={2.5}>
          <Typography variant="subtitle1" color="text.secondary">
            {t('assessments:comments')}
          </Typography>
          <RHFSwitch<FormValues>
            label={t('assessments:labels.includeTeacherComments')}
            switchProps={{ color: 'success' }}
            controlProps={{ name: 'includeTeacherComments', control }}
          />
          {showTeacherComments && (
            <Stack direction="row" gap={2}>
              <RHFSelect<FormValues, CommentTypeOption>
                label={t('assessments:labels.commentType')}
                options={commentTypeOptions}
                controlProps={{ name: 'commentType', control }}
                getOptionLabel={(option) =>
                  t(`assessments:labels.commentTypes.${option}`)
                }
                sx={textFieldStyle}
              />
              {(commentTypeValue === CommentType.CommentBank ||
                commentTypeValue === CommentType.Both) && (
                <CommentBankOptions<FormValues>
                  name="commentBank"
                  control={control}
                />
              )}

              {(commentTypeValue === CommentType.FreeForm ||
                commentTypeValue === CommentType.Both) && (
                <CommentLengthField<FormValues>
                  name="commentLength"
                  control={control}
                />
              )}
            </Stack>
          )}
          {(
            [
              {
                label: t('assessments:labels.includeClassTutorComment'),
                name: 'captureTutorComment',
              },
              {
                label: t('assessments:labels.includeYearHeadComment'),
                name: 'captureYearHeadComment',
              },
              {
                label: t('assessments:labels.includeHousemasterComment'),
                name: 'captureHouseMasterComment',
              },
              {
                label: t('assessments:labels.includePrincipalComment'),
                name: 'capturePrincipalComment',
              },
            ] as Array<{ label: string; name: Path<FormValues> }>
          ).map(({ label, name }) => (
            <RHFSwitch<FormValues>
              key={name}
              label={label}
              switchProps={{ color: 'success' }}
              controlProps={{ name, control }}
            />
          ))}
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
