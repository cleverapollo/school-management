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
import { CommentType, AssessmentType, useYearGroups } from '@tyro/api';
import { Card, Stack, CardHeader, Typography } from '@mui/material';
import { useForm, Path } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { CommentBankOption } from '../api/comment-bank';
import { useSaveTermAssessment } from '../api/save-term-assessment';
import { CommentBankOptions } from '../components/term-assessment/comment-bank-options';
import { CommentLengthField } from '../components/term-assessment/comment-length-field';
import {
  CustomFieldsTable,
  FormCustomFieldsValues,
} from '../components/term-assessment/custom-fields-table';

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

export default function CreateTermAssessmentPage() {
  const { toast } = useToast();
  const { t } = useTranslation(['assessment', 'common']);

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
    commentBank,
    commentType,
    extraFields,
    ...restData
  }: FormValues) => {
    saveTermAssessment(
      {
        // TODO: check the following errors
        // "java.lang.NullPointerException: Cannot invoke "java.util.List.size()" because the return value of "io.tyro.assessment_api.model.gen.SaveAssessmentInput.getGradeSetIds()" is null"
        // "java.lang.NullPointerException: Cannot invoke "io.tyro.assessment_api.model.gen.GradeType.name()" because the return value of "io.tyro.assessment_api.model.gen.SaveAssessmentInput.getGradeType()" is null"
        ...restData,
        assessmentType: AssessmentType.Term,
        gradeSetIds: [],
        years: years.map(({ yearGroupId }) => yearGroupId),
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        commentType: commentType ?? CommentType.None,
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
        },
        onError: console.error,
      }
    );
  };

  const labelStyle = {
    color: 'slate.400',
    fontWeight: 600,
  };

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  return (
    <>
      <PageHeading
        title={t('assessment:title')}
        breadcrumbs={{
          links: [
            {
              name: t('assessment:termAssessments'),
              href: './..',
            },
            {
              name: t('assessment:termAssessmentCreation'),
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
          title={t('assessment:termAssessmentCreation')}
          sx={{
            p: 3,
            pt: 2.25,
            pb: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
        <Stack direction="column" gap={3} p={3}>
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
              {t('assessment:details')}
            </Typography>
            <Stack direction="row" gap={2}>
              <RHFTextField<FormValues>
                label={t('assessment:labels.assessmentName')}
                textFieldProps={{ sx: textFieldStyle }}
                controlProps={{
                  name: 'name',
                  control,
                }}
              />
              <RHFAutocomplete<FormValues, YearGroupOption>
                label={t('assessment:labels.years')}
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
                label={t('assessment:labels.startDate')}
                controlProps={{ name: 'startDate', control }}
                inputProps={{ sx: textFieldStyle }}
              />
              <RHFDatePicker<FormValues>
                label={t('assessment:labels.endDate')}
                controlProps={{ name: 'endDate', control }}
                inputProps={{ sx: textFieldStyle }}
              />
            </Stack>
          </Stack>
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
              {t('assessment:grades')}
            </Typography>
            <RHFSwitch<FormValues>
              label={t('assessment:labels.includeTargetGrades')}
              switchProps={{ color: 'success' }}
              controlProps={{ name: 'captureTarget', control }}
            />
          </Stack>
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
              {t('assessment:comments')}
            </Typography>
            <RHFSwitch<FormValues>
              label={t('assessment:labels.includeTeacherComments')}
              switchProps={{ color: 'success' }}
              controlProps={{ name: 'includeTeacherComments', control }}
            />
            {showTeacherComments && (
              <Stack direction="row" gap={2}>
                <RHFSelect<FormValues, CommentTypeOption>
                  label={t('assessment:labels.commentType')}
                  options={commentTypeOptions}
                  controlProps={{ name: 'commentType', control }}
                  getOptionLabel={(option) =>
                    t(`assessment:labels.commentTypes.${option}`)
                  }
                  textFieldProps={{ sx: textFieldStyle }}
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
                  label: t('assessment:labels.includeClassTutorComment'),
                  name: 'captureTutorComment',
                },
                {
                  label: t('assessment:labels.includeYearHeadComment'),
                  name: 'captureYearHeadComment',
                },
                {
                  label: t('assessment:labels.includeHousemasterComment'),
                  name: 'captureHouseMasterComment',
                },
                {
                  label: t('assessment:labels.includePrincipalComment'),
                  name: 'includePrincipalComment',
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
              {t('assessment:createTermAssessment')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
