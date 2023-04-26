import { useTranslation } from '@tyro/i18n';
import {
  PageHeading,
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  useFormValidator,
  useToast,
} from '@tyro/core';
import {
  CommentType,
  AssessmentType,
  useYearGroups,
  GradeType,
} from '@tyro/api';
import { Card, Stack, CardHeader, Typography } from '@mui/material';
import { useForm, Path } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { CommentBankOption } from '../../api/comment-bank';
import { useSaveTermAssessment } from '../../api/save-term-assessment';
import { CommentBankOptions } from '../../components/term-assessment/comment-bank-options';
import { CommentLengthField } from '../../components/term-assessment/comment-length-field';
import {
  CustomFieldsTable,
  FormCustomFieldsValues,
} from '../../components/term-assessment/custom-fields-table';
import { PageContainer } from '../../components/page-container';

type YearGroupOption = NonNullable<
  NonNullable<ReturnType<typeof useYearGroups>['data']>[number]
>;

type CommentTypeOption = Exclude<CommentType, CommentType.None>;

const commentTypeOptions: CommentTypeOption[] = [
  CommentType.CommentBank,
  CommentType.FreeForm,
  CommentType.Both,
];

interface FormValues extends FormCustomFieldsValues {
  // Details
  name: string;
  years: YearGroupOption[];
  startDate: Date;
  endDate: Date;
  // Grades
  captureTarget: boolean;
  // Comments
  includeTeacherComments: boolean;
  commentType: CommentTypeOption;
  commentBank: CommentBankOption;
  commentLength: number;
  captureTutorComment: boolean;
  captureYearHeadComment: boolean;
  captureHouseMasterComment: boolean;
  capturePrincipalComment: boolean;
}

const COMMENT_LENGTH_MIN = 1;
const COMMENT_LENGTH_MAX = 1000;
const ASSESSMENTS_LIST_PATH = '/assessments';

export default function CreateTermAssessmentPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation(['assessments', 'common']);

  const { data: yearGroupsData = [] } = useYearGroups({});
  const { mutate: saveTermAssessment, isLoading } = useSaveTermAssessment();

  const { resolver, rules } = useFormValidator<FormValues>();

  const { control, handleSubmit, watch } = useForm<FormValues>({
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
    ...restData
  }: FormValues) => {
    saveTermAssessment(
      {
        ...restData,
        assessmentType: AssessmentType.Term,
        gradeType: GradeType.Both,
        years: years.map(({ yearGroupId }) => yearGroupId),
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        commentType: includeTeacherComments ? commentType : CommentType.None,
        commentBankId: commentBank?.id ?? null,
        extraFields: extraFields.map((field) => ({
          name: field.name,
          extraFieldType: field.extraFieldType,
          commentBankId: field.commentBank?.id ?? null,
          commentLength: field.commentLength ?? null,
        })),
      },
      {
        onSuccess: () => {
          toast(t('common:snackbarMessages.createSuccess'));
          navigate(ASSESSMENTS_LIST_PATH);
        },
        onError: console.error,
      }
    );
  };

  const labelStyle = {
    color: 'text.secondary',
    fontWeight: 600,
  };

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  return (
    <PageContainer title={t('assessments:pageTitle.createTermAssessment')}>
      <PageHeading
        title={t('assessments:pageHeading.termAssessments')}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: ASSESSMENTS_LIST_PATH,
            },
            {
              name: t('assessments:pageHeading.createTermAssessment'),
            },
          ],
        }}
      />

      <Card
        variant="outlined"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CardHeader
          component="h2"
          title={t('assessments:pageHeading.createTermAssessment')}
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
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
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
                autocompleteProps={{
                  multiple: true,
                  sx: textFieldStyle,
                  options: yearGroupsData as YearGroupOption[],
                }}
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
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
              {t('assessments:grades')}
            </Typography>
            <RHFSwitch<FormValues>
              label={t('assessments:labels.includeTargetGrades')}
              switchProps={{ color: 'success' }}
              controlProps={{ name: 'captureTarget', control }}
            />
          </Stack>
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
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
              {t('assessments:createTermAssessment')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </PageContainer>
  );
}
