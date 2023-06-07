import {
  CardHeader,
  Card,
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  CardProps,
} from '@mui/material';
import { EditIcon, UndoIcon, SaveIcon } from '@tyro/icons';
import {
  FieldValues,
  Path,
  PathValue,
  useForm,
  UseControllerProps,
  Resolver,
} from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import {
  ReactNode,
  ReactElement,
  cloneElement,
  useState,
  useEffect,
} from 'react';

type CardEditableField<TField extends FieldValues> = {
  label: string;
  // NOTE: this is the proper type but as it is a recursive typed function it causes eslint/typescript performance issues.
  // value: PathValue<TField, Path<TField>>;
  value: any;
  valueEditor?: ReactElement<{ controlProps: UseControllerProps<TField> }>;
  valueRenderer?: ReactNode;
  readOnly?: boolean;
};

export type CardEditableFormProps<TField extends FieldValues> = CardProps & {
  title: string;
  editable?: boolean;
  fields: Array<CardEditableField<TField>>;
  resolver?: Resolver<TField>;
  onSave: (data: TField) => void;
};

export const CardEditableForm = <TField extends FieldValues>({
  title,
  editable,
  fields,
  resolver,
  onSave,
  sx,
  children,
  ...cardProps
}: CardEditableFormProps<TField>) => {
  const { t } = useTranslation(['common']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { control, handleSubmit, reset } = useForm<TField>({ resolver });

  const handleSave = (data: TField) => {
    setIsSubmitting(true);
    onSave(data);
  };

  useEffect(() => {
    setIsEditMode(false);
    setIsSubmitting(false);
  }, [fields]);

  const handleCancel = () => {
    setIsEditMode(false);
    reset();
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <Card
      variant="outlined"
      sx={{ position: 'static', overflow: 'inherit', ...sx }}
      component="form"
      onSubmit={handleSubmit(handleSave)}
      {...cardProps}
    >
      <CardHeader
        title={title}
        {...(editable && {
          action: isEditMode ? (
            <Stack direction="row">
              <Tooltip title={t('common:actions.cancel')}>
                <IconButton
                  aria-label={t('common:actions.cancel')}
                  onClick={handleCancel}
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('common:actions.save')}>
                <IconButton aria-label={t('common:actions.save')} type="submit">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Tooltip title={t('common:actions.edit')}>
              <IconButton
                aria-label={t('common:actions.edit')}
                onClick={handleEdit}
                disabled={isSubmitting}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          ),
        })}
      />
      <Box
        component="dl"
        sx={{
          p: 3,
          m: 0,
          display: 'grid',
          gridRowGap: '2rem',
          gridColumnGap: '4rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        }}
      >
        {fields.map(
          ({ label, value, valueRenderer, valueEditor, readOnly }) => {
            const canBeEdited = isEditMode && !readOnly && valueEditor;

            return (
              <Box key={label}>
                <Typography component="dt" variant="subtitle1">
                  {label}
                </Typography>

                {canBeEdited ? (
                  cloneElement(valueEditor, {
                    controlProps: {
                      name: valueEditor.props.controlProps.name,
                      control,
                      defaultValue: value as PathValue<TField, Path<TField>>,
                    },
                  })
                ) : (
                  <Typography paddingY={0.5} component="dd" variant="body1">
                    {valueRenderer || value || '-'}
                  </Typography>
                )}
              </Box>
            );
          }
        )}
      </Box>
      <Box p={3}>{children}</Box>
    </Card>
  );
};
