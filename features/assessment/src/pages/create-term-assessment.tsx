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
  SaveExtraFieldInput,
  CommentType,
  ExtraFieldType,
  AssessmentType,
  useYearGroups,
} from '@tyro/api';
import {
  Card,
  Stack,
  CardHeader,
  Typography,
  Button,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { useForm, useFieldArray, Path } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { CommentBankOption } from '../api/comment-bank';
import { useSaveTermAssessment } from '../api/save-term-assessment';
import { CommentBankOptions } from '../components/term-assessment/comment-bank-options';
import { CommentLengthField } from '../components/term-assessment/comment-length-field';

type YearGroupOption = NonNullable<
  NonNullable<ReturnType<typeof useYearGroups>['data']>[number]
>;

type CommentTypeOption = Exclude<CommentType, CommentType.None>;

const commentTypeOptions: CommentTypeOption[] = [
  CommentType.CommentBank,
  CommentType.FreeForm,
  CommentType.Both,
];

type ExtraFieldTypeOption = Exclude<
  ExtraFieldType,
  ExtraFieldType.GradeSet | ExtraFieldType.Select
>;

const extraFieldTypeOptions: ExtraFieldTypeOption[] = [
  ExtraFieldType.FreeForm,
  ExtraFieldType.CommentBank,
];

type FormValues = {
  // Details
  assessmentName: string;
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
  extraFields: Array<
    Pick<SaveExtraFieldInput, 'name' | 'extraFieldType'> & {
      commentLength?: number;
      commentBank?: CommentBankOption;
    }
  >;
};
const EXTRA_FIELDS_MAX_LENGTH = 12;
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
      assessmentName: rules.required(),
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'extraFields',
  });

  const [includeTeacherComments, commentType, extraFields] = watch([
    'includeTeacherComments',
    'commentType',
    'extraFields',
  ]);

  const onSubmit = (data: FormValues) => {
    saveTermAssessment(
      {
        // TODO: check the following errors
        // "java.lang.NullPointerException: Cannot invoke "java.util.List.size()" because the return value of "io.tyro.assessment_api.model.gen.SaveAssessmentInput.getGradeSetIds()" is null"
        // "java.lang.NullPointerException: Cannot invoke "io.tyro.assessment_api.model.gen.GradeType.name()" because the return value of "io.tyro.assessment_api.model.gen.SaveAssessmentInput.getGradeType()" is null"
        assessmentType: AssessmentType.Term,
        name: data.assessmentName,
        years: data.years.map((year) => year.yearGroupId),
        startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
        captureTarget: !!data.captureTarget,
        commentType: data.includeTeacherComments
          ? data.commentType
          : CommentType.None,
        commentBankId: data.commentBank?.id ?? null,
        commentLength: data.commentLength ?? null,
        capturePrincipalComment: !!data.capturePrincipalComment,
        captureYearHeadComment: !!data.captureYearHeadComment,
        captureTutorComment: !!data.captureTutorComment,
        captureHouseMasterComment: !!data.captureHouseMasterComment,
        extraFields: data.extraFields.map((field) => ({
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
                  name: 'assessmentName',
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
            {includeTeacherComments && (
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
                {(commentType === CommentType.CommentBank ||
                  commentType === CommentType.Both) && (
                  <CommentBankOptions<FormValues>
                    name="commentBank"
                    control={control}
                  />
                )}

                {(commentType === CommentType.FreeForm ||
                  commentType === CommentType.Both) && (
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
          {/* TODO: move to its own component */}
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
              {t('assessment:customFields')}
            </Typography>
            {fields.length > 0 && (
              <Table
                size="small"
                sx={{
                  '& th': {
                    background: 'transparent',
                    color: 'text.primary',
                    fontWeight: 600,
                    width: '33%',
                  },
                  '& th:first-of-type, & th:last-of-type': {
                    width: 'auto',
                  },
                  '& tbody td': {
                    verticalAlign: 'baseline',
                  },
                  '& tbody td:first-of-type, & tbody td:last-of-type': {
                    verticalAlign: 'middle',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>{t('assessment:extraFieldNo')}</TableCell>
                    <TableCell>{t('assessment:extraFieldName')}</TableCell>
                    <TableCell>{t('assessment:extraFieldType')}</TableCell>
                    <TableCell>{t('assessment:extraFieldValue')}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <RHFTextField<FormValues>
                          textFieldProps={{
                            fullWidth: true,
                            'aria-label': t(
                              'assessment:placeholders.extraFieldName'
                            ),
                            placeholder: t(
                              'assessment:placeholders.extraFieldName'
                            ),
                          }}
                          controlProps={{
                            name: `extraFields.${index}.name`,
                            control,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <RHFSelect<FormValues, ExtraFieldTypeOption>
                          textFieldProps={{ fullWidth: true }}
                          options={extraFieldTypeOptions}
                          getOptionLabel={(option) =>
                            t(`assessment:labels.extraFieldTypes.${option}`)
                          }
                          controlProps={{
                            name: `extraFields.${index}.extraFieldType`,
                            control,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {extraFields[index].extraFieldType ===
                          ExtraFieldType.FreeForm && (
                          <CommentLengthField<FormValues>
                            name={`extraFields.${index}.commentLength`}
                            control={control}
                          />
                        )}
                        {extraFields[index].extraFieldType ===
                          ExtraFieldType.CommentBank && (
                          <CommentBankOptions<FormValues>
                            name={`extraFields.${index}.commentBank`}
                            control={control}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          aria-label={t('common:delete')}
                          onClick={() => remove(index)}
                        >
                          <TrashIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Stack width="fit-content">
              <Button
                size="small"
                color="primary"
                variant="text"
                disabled={fields.length === EXTRA_FIELDS_MAX_LENGTH}
                onClick={() =>
                  append({
                    name: '',
                    extraFieldType: ExtraFieldType.CommentBank,
                  })
                }
                startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
              >
                {t('assessment:addCustomField')}
              </Button>
            </Stack>
          </Stack>

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
