import { useTranslation } from '@tyro/i18n';
import {
  PageHeading,
  RHFAutocomplete,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  useFormValidator,
} from '@tyro/core';
import { SaveExtraFieldInput, CommentType, ExtraFieldType } from '@tyro/api';
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
import { useCommentBank, useYearGroups } from '../api';

type YearGroupOption = NonNullable<
  NonNullable<ReturnType<typeof useYearGroups>['data']>[number]
>;

type CommentBankOption = NonNullable<
  NonNullable<ReturnType<typeof useCommentBank>['data']>[number]
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
  includeTargetGrades: boolean;
  // Comments
  includeTeacherComments: boolean;
  commentType: CommentTypeOption;
  commentBank: CommentBankOption;
  commentLength: number;
  captureTutorComment: boolean;
  captureYearHeadComment: boolean;
  captureHouseMasterComment: boolean;
  capturePrincipalComment: boolean;
  extraFields: Partial<
    SaveExtraFieldInput & {
      commentLength: number;
      commentBank: CommentBankOption;
    }
  >[];
};
const EXTRA_FIELDS_MAX_LENGTH = 12;
const COMMENT_LENGTH_MIN = 1;
const COMMENT_LENGTH_MAX = 1000;

export default function CreateTermAssessmentPage() {
  const { t } = useTranslation(['assessment', 'common']);

  const { data: yearGroupsData = [] } = useYearGroups({});
  const { data: commentBankData = [] } = useCommentBank({});

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
        rules.minLength(COMMENT_LENGTH_MIN),
        rules.maxLength(COMMENT_LENGTH_MAX),
      ],
      extraFields: {
        name: rules.required(),
        extraFieldType: rules.required(),
        commentBank: rules.required(),
        commentLength: [
          rules.required(),
          rules.minLength(COMMENT_LENGTH_MIN),
          rules.maxLength(COMMENT_LENGTH_MAX),
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

  const onSubmit = (data: FormValues) => console.log(data);

  const labelStyle = {
    color: 'slate.400',
    fontWeight: 600,
  };

  const textFieldStyle = {
    maxWidth: 300,
    width: '100%',
  };

  const renderCommentBankOptions = (name: Path<FormValues>) => (
    <RHFAutocomplete<FormValues, CommentBankOption>
      label={t('assessment:labels.commentBankOptions')}
      optionIdKey="id"
      optionTextKey="name"
      controlProps={{ name, control }}
      autocompleteProps={{
        sx: textFieldStyle,
        options: commentBankData as CommentBankOption[],
      }}
    />
  );

  const renderCommentLength = (name: Path<FormValues>) => (
    <RHFTextField<FormValues>
      label={t('assessment:labels.commentLength')}
      textFieldProps={{
        sx: textFieldStyle,
        type: 'number',
        inputProps: { maxLength: 3 },
      }}
      controlProps={{ name, control }}
    />
  );

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
            <Typography variant="body1" sx={{ ...labelStyle }}>
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
            <Typography variant="body1" sx={{ ...labelStyle }}>
              {t('assessment:grades')}
            </Typography>
            <RHFSwitch<FormValues>
              label={t('assessment:labels.includeTargetGrades')}
              switchProps={{ color: 'success' }}
              controlProps={{ name: 'includeTargetGrades', control }}
            />
          </Stack>
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" sx={{ ...labelStyle }}>
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
                  commentType === CommentType.Both) &&
                  renderCommentBankOptions('commentBank')}

                {(commentType === CommentType.FreeForm ||
                  commentType === CommentType.Both) &&
                  renderCommentLength('commentLength')}
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
          <Stack direction="column" gap={2.5}>
            <Typography variant="body1" sx={{ ...labelStyle }}>
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
                          ExtraFieldType.FreeForm &&
                          renderCommentLength(
                            `extraFields.${index}.commentLength`
                          )}
                        {extraFields[index].extraFieldType ===
                          ExtraFieldType.CommentBank &&
                          renderCommentBankOptions(
                            `extraFields.${index}.commentBank`
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
            <LoadingButton variant="contained" size="large" type="submit">
              {t('assessment:createTermAssessment')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
