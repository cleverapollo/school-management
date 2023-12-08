import { useTranslation } from '@tyro/i18n';
import { RHFTextField, RHFSelect } from '@tyro/core';
import { ExtraFieldType, SaveExtraFieldInput } from '@tyro/api';
import {
  Stack,
  Typography,
  Button,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { useFieldArray, Control, useWatch } from 'react-hook-form';
import { CommentBankOptions } from './comment-bank-options';
import { CommentLengthField } from './comment-length-field';
import { CommentBankOption } from '../../api/comment-bank';

type ExtraFieldTypeOption = Exclude<
  ExtraFieldType,
  ExtraFieldType.GradeSet | ExtraFieldType.Select
>;

const extraFieldTypeOptions: ExtraFieldTypeOption[] = [
  ExtraFieldType.FreeForm,
  ExtraFieldType.CommentBank,
];

const EXTRA_FIELDS_MAX_LENGTH = 12;

type ExtraField = Pick<
  SaveExtraFieldInput,
  'id' | 'name' | 'extraFieldType'
> & {
  commentLength?: number | null;
  commentBank?: Partial<CommentBankOption>;
  resultsEntered?: boolean;
};

export type FormCustomFieldsValues = {
  extraFields: ExtraField[];
};

type CustomFieldsTableProps<TField extends FormCustomFieldsValues> = {
  control: TField extends FormCustomFieldsValues ? Control<TField> : never;
};

export const CustomFieldsTable = <TField extends FormCustomFieldsValues>({
  control,
}: CustomFieldsTableProps<TField>) => {
  const { t } = useTranslation(['assessments', 'common']);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'extraFields',
  });

  const { extraFields = [] } = useWatch({ control });

  const labelStyle = {
    color: 'text.secondary',
    fontWeight: 600,
  };

  return (
    <Stack direction="column" gap={2.5}>
      <Typography variant="body1" component="h3" sx={{ ...labelStyle }}>
        {t('assessments:customFields')}
      </Typography>
      {fields.length > 0 && (
        <Table
          size="small"
          sx={{
            '& th': {
              background: 'transparent',
              color: 'text.secondary',
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
              <TableCell>{t('assessments:extraFieldNo')}</TableCell>
              <TableCell>{t('assessments:extraFieldName')}</TableCell>
              <TableCell>{t('assessments:extraFieldType')}</TableCell>
              <TableCell>{t('assessments:extraFieldValue')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => {
              const extraField = extraFields[index];
              const disableRemoveButton = !!extraField?.resultsEntered;

              return (
                <TableRow key={field.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <RHFTextField<FormCustomFieldsValues>
                      textFieldProps={{
                        fullWidth: true,
                        'aria-label': t(
                          'assessments:placeholders.extraFieldName'
                        ),
                        placeholder: t(
                          'assessments:placeholders.extraFieldName'
                        ),
                      }}
                      controlProps={{
                        name: `extraFields.${index}.name`,
                        control,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <RHFSelect<FormCustomFieldsValues, ExtraFieldTypeOption>
                      fullWidth
                      options={extraFieldTypeOptions}
                      getOptionLabel={(option) =>
                        t(`assessments:labels.extraFieldTypes.${option}`)
                      }
                      controlProps={{
                        name: `extraFields.${index}.extraFieldType`,
                        control,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {extraField?.extraFieldType === ExtraFieldType.FreeForm && (
                      <CommentLengthField<FormCustomFieldsValues>
                        name={`extraFields.${index}.commentLength`}
                        control={control}
                      />
                    )}
                    {extraField?.extraFieldType ===
                      ExtraFieldType.CommentBank && (
                      <CommentBankOptions<FormCustomFieldsValues>
                        name={`extraFields.${index}.commentBank`}
                        control={control}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        disableRemoveButton
                          ? t(
                              'assessments:thereAreCustomFieldCommentsPleaseDelete'
                            )
                          : undefined
                      }
                    >
                      <span>
                        <IconButton
                          color="primary"
                          aria-label={t('common:delete')}
                          onClick={() => remove(index)}
                          disabled={disableRemoveButton}
                        >
                          <TrashIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
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
          {t('assessments:addCustomField')}
        </Button>
      </Stack>
    </Stack>
  );
};
