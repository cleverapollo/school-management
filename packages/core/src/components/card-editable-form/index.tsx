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

import { EditIcon, UndoIcon, SaveIcon, InfoCircleIcon } from '@tyro/icons';
import {
  FieldValues,
  Path,
  PathValue,
  useForm,
  UseControllerProps,
  Resolver,
} from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { ReactNode, ReactElement, cloneElement, useState } from 'react';

type CardEditableField<TField extends FieldValues> = {
  label: string;
  labelForEditingMode?: string;
  tooltipInfo?: string;
  // NOTE: this is the proper type but as it is a recursive typed function it causes eslint/typescript performance issues.
  // value: PathValue<TField, Path<TField>>;
  value: any;
  valueEditor?: ReactElement<{ controlProps: UseControllerProps<TField> }>;
  valueRenderer?: ReactNode;
  readOnly?: boolean;
  showOnlyOnEdition?: boolean;
};

export type CardEditableFormProps<TField extends FieldValues> = CardProps & {
  title: string;
  editable?: boolean;
  hideBorder?: boolean;
  fields: Array<CardEditableField<TField>>;
  resolver?: Resolver<TField>;
  onSave: (data: TField, onSuccess: () => void) => void;
  onEdit?: () => void;
  onCancel?: () => void;
};

export const CardEditableForm = <TField extends FieldValues>({
  title,
  editable,
  fields,
  resolver,
  onSave,
  onEdit,
  onCancel,
  hideBorder,
  sx,
  children,
  ...cardProps
}: CardEditableFormProps<TField>) => {
  const { t } = useTranslation(['common']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TField>({ resolver });

  const handleSave = (data: TField) => {
    if (isDirty) {
      setIsSubmitting(true);
      onSave(data, () => {
        setIsEditMode(false);
        setIsSubmitting(false);
      });
    } else {
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    reset();
    onCancel?.();
  };

  const handleEdit = () => {
    setIsEditMode(true);
    onEdit?.();
  };

  return (
    <Card
      variant="outlined"
      sx={{
        ...{ position: 'static', overflow: 'inherit', ...sx },
        ...(hideBorder && {
          border: 'none',
          '.MuiCardHeader-root': { borderBottom: 'none !important' },
        }),
      }}
      component={isEditMode ? 'form' : 'div'}
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
                  disabled={isSubmitting}
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('common:actions.save')}>
                <IconButton
                  aria-label={t('common:actions.save')}
                  type="submit"
                  disabled={isSubmitting}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Tooltip title={t('common:actions.edit')}>
              <IconButton
                aria-label={t('common:actions.edit')}
                onClick={handleEdit}
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
          (
            {
              label,
              labelForEditingMode = label,
              tooltipInfo,
              value,
              valueRenderer,
              valueEditor,
              showOnlyOnEdition,
              readOnly,
            },
            index
          ) => {
            const canBeEdited = isEditMode && !readOnly && valueEditor;

            if (showOnlyOnEdition && !isEditMode) return null;

            return (
              <Box
                key={`${label}-${index}`}
                component={canBeEdited ? 'label' : 'div'}
              >
                <Stack
                  component="span"
                  gap={0.5}
                  flexDirection="row"
                  alignItems="center"
                >
                  <Typography flex="1 0 0%" component="dt" variant="subtitle1">
                    {isEditMode ? labelForEditingMode : label}
                  </Typography>

                  {tooltipInfo && (
                    <Box display="flex" flex="1" justifyContent="flex-start">
                      <Tooltip title={tooltipInfo}>
                        <InfoCircleIcon sx={{ width: 18, height: 18 }} />
                      </Tooltip>
                    </Box>
                  )}
                </Stack>

                {canBeEdited ? (
                  cloneElement(valueEditor, {
                    controlProps: {
                      name: valueEditor.props.controlProps.name,
                      control,
                      defaultValue: value as PathValue<TField, Path<TField>>,
                    },
                  })
                ) : (
                  <Typography
                    paddingY={0.5}
                    component="dd"
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      overflowWrap: 'break-word',
                    }}
                  >
                    {valueRenderer || value || '-'}
                  </Typography>
                )}
              </Box>
            );
          }
        )}
      </Box>
      <Box p={3} pt={0}>
        {children}
      </Box>
    </Card>
  );
};
