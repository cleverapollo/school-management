import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  useFormValidator,
  useNumber,
} from '@tyro/core';

import {
  CommentType,
  useYearGroups,
  AssessmentType,
  GradeType,
  UseQueryReturnType,
} from '@tyro/api';
import { Card, Stack, CardHeader, Typography, Collapse } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
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

const teacherCommentTypeOptions: CommentTypeOption[] = [
  CommentType.CommentBank,
  CommentType.FreeForm,
  CommentType.Both,
];

const generalCommentTypeOptions: CommentTypeOption[] = [
  CommentType.CommentBank,
  CommentType.FreeForm,
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
  tutorCommentType?: CommentType | null;
  tutorCommentBank?: Partial<CommentBankOption>;
  tutorCommentLength?: number | null;
  yearHeadCommentType?: CommentType | null;
  yearHeadCommentBank?: Partial<CommentBankOption>;
  yearHeadCommentLength?: number | null;
  principalCommentType?: CommentType | null;
  principalCommentBank?: Partial<CommentBankOption>;
  principalCommentLength?: number | null;
  housemasterCommentType?: CommentType | null;
  housemasterCommentBank?: Partial<CommentBankOption>;
  housemasterCommentLength?: number | null;
}

type TermAssessmentFormProps = {
  termAssessment?: FormValues;
  title: string;
  onSuccess: () => void;
  onError: () => void;
};

const COMMENT_LENGTH_MIN = 1;
const COMMENT_LENGTH_MAX = 1000;

export function TermAssessmentForm({
  termAssessment,
  title,
  onSuccess,
  onError,
}: TermAssessmentFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'assessments']);
  const { academicNamespaceId } = useParams();
  const academicNamespaceIdAsNumber = useNumber(academicNamespaceId);

  const { data: yearGroupsData = [] } = useYearGroups({});

  const { resolver, rules } = useFormValidator<FormValues>();
  const { mutate: saveTermAssessment, isLoading } = useSaveTermAssessment(
    academicNamespaceIdAsNumber
  );

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
      tutorCommentType: rules.required(),
      tutorCommentBank: rules.required(),
      tutorCommentLength: [
        rules.required(),
        rules.min(COMMENT_LENGTH_MIN),
        rules.max(COMMENT_LENGTH_MAX),
      ],
      yearHeadCommentType: rules.required(),
      yearHeadCommentBank: rules.required(),
      yearHeadCommentLength: [
        rules.required(),
        rules.min(COMMENT_LENGTH_MIN),
        rules.max(COMMENT_LENGTH_MAX),
      ],
      housemasterCommentType: rules.required(),
      housemasterCommentBank: rules.required(),
      housemasterCommentLength: [
        rules.required(),
        rules.min(COMMENT_LENGTH_MIN),
        rules.max(COMMENT_LENGTH_MAX),
      ],
      principalCommentType: rules.required(),
      principalCommentBank: rules.required(),
      principalCommentLength: [
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
    tutorCommentBank,
    yearHeadCommentBank,
    principalCommentBank,
    housemasterCommentBank,
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
        tutorCommentBankId: tutorCommentBank?.id,
        yearHeadCommentBankId: yearHeadCommentBank?.id,
        principalCommentBankId: principalCommentBank?.id,
        housemasterCommentBankId: housemasterCommentBank?.id,
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
      <CardHeader component="h2" title={title} />
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
              label={t('assessments:labels.years', { count: 2 })}
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
          {(
            [
              {
                label: t('assessments:labels.includeTeacherComments'),
                name: 'includeTeacherComments',
                commentType: 'commentType',
                commentBankName: 'commentBank',
                commentLengthName: 'commentLength',
              },
              {
                label: t('assessments:labels.includeClassTutorComment'),
                name: 'captureTutorComment',
                commentType: 'tutorCommentType',
                commentBankName: 'tutorCommentBank',
                commentLengthName: 'tutorCommentLength',
              },
              {
                label: t('assessments:labels.includeYearHeadComment'),
                name: 'captureYearHeadComment',
                commentType: 'yearHeadCommentType',
                commentBankName: 'yearHeadCommentBank',
                commentLengthName: 'yearHeadCommentLength',
              },
              // Hiding for now. Will need to enable based on school info that tells us if school is boarding school
              // {
              //   label: t('assessments:labels.includeHousemasterComment'),
              //   name: 'captureHouseMasterComment',
              //   commentType: 'housemasterCommentType',
              //   commentBankName: 'housemasterCommentBank',
              //   commentLengthName: 'housemasterCommentLength',
              // },
              {
                label: t('assessments:labels.includePrincipalComment'),
                name: 'capturePrincipalComment',
                commentType: 'principalCommentType',
                commentBankName: 'principalCommentBank',
                commentLengthName: 'principalCommentLength',
              },
            ] as const
          ).map(
            ({
              label,
              name,
              commentType,
              commentBankName,
              commentLengthName,
            }) => {
              const [showComments, commentTypeValue] = watch([
                name,
                commentType,
              ]);

              return (
                <Stack key={name}>
                  <RHFSwitch<FormValues>
                    label={label}
                    switchProps={{ color: 'success' }}
                    controlProps={{ name, control }}
                  />
                  <Collapse in={showComments} unmountOnExit>
                    <Stack direction="row" gap={2} pt={1}>
                      <RHFSelect<FormValues, CommentTypeOption>
                        label={t('assessments:labels.commentType')}
                        options={
                          name === 'includeTeacherComments'
                            ? teacherCommentTypeOptions
                            : generalCommentTypeOptions
                        }
                        controlProps={{ name: commentType, control }}
                        getOptionLabel={(option) =>
                          t(`assessments:labels.commentTypes.${option}`)
                        }
                        sx={textFieldStyle}
                      />
                      {(commentTypeValue === CommentType.CommentBank ||
                        commentTypeValue === CommentType.Both) && (
                        <CommentBankOptions<FormValues>
                          name={commentBankName}
                          control={control}
                        />
                      )}

                      {(commentTypeValue === CommentType.FreeForm ||
                        commentTypeValue === CommentType.Both) && (
                        <CommentLengthField<FormValues>
                          name={commentLengthName}
                          control={control}
                        />
                      )}
                    </Stack>
                  </Collapse>
                </Stack>
              );
            }
          )}
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
    </Card>
  );
}
