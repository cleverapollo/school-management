import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, Button, Collapse, Stack } from '@mui/material';
import {
  Forms_FormView,
  Forms_SubmitFormInput,
  Forms_SubmitFormResponse,
} from '@tyro/api';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { LoadingPlaceholderContainer } from '../../loading-placeholder';
import { FieldGroup } from './group';

export interface DynamicFormProps<Fields extends FieldValues> {
  formSettings: Forms_FormView | undefined;
  onSubmit: (
    data: Forms_SubmitFormInput['fields']
  ) => Promise<Forms_SubmitFormResponse>;
  onCancel?: () => void;
}

export const DynamicForm = <Fields extends FieldValues>({
  formSettings,
  onSubmit,
  onCancel,
}: DynamicFormProps<Fields>) => {
  const { t } = useTranslation(['common']);
  const { control, handleSubmit, setError } = useForm<Fields>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  const requestSubmit = async (data: Fields) => {
    setIsSubmitting(true);
    const convertedData = Object.entries(data).reduce<
      Forms_SubmitFormInput['fields']
    >((acc, [fieldId, value]) => {
      acc.push({
        fieldId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value,
      });
      return acc;
    }, []);
    const { success, validations } = await onSubmit(convertedData);
    if (!success && validations?.fieldErrors) {
      const typedErrors = validations?.fieldErrors as Record<string, string>;
      Object.entries(typedErrors).forEach(([field, error]) => {
        setError(field as Path<Fields>, { message: error });
      });

      setGlobalErrors(validations?.globalErrors ?? []);
    }
    setIsSubmitting(false);
  };

  return (
    <LoadingPlaceholderContainer isLoading={!formSettings}>
      <Stack component="form" onSubmit={handleSubmit(requestSubmit)} gap={3}>
        <Collapse in={globalErrors.length > 0}>
          <Alert severity="error">
            <AlertTitle>Please fix the following errors</AlertTitle>

            <Box component="ul" sx={{ m: 0, pl: '14px' }}>
              {globalErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </Box>
          </Alert>
        </Collapse>
        {formSettings?.fields?.map((fieldGroup) => (
          <FieldGroup
            key={fieldGroup?.header}
            group={fieldGroup}
            control={control}
          />
        ))}
        <Stack direction="row" gap={2} justifyContent="flex-end">
          {onCancel && (
            <Button
              variant="soft"
              size="large"
              color="primary"
              onClick={onCancel}
            >
              {t('common:actions.cancel')}
            </Button>
          )}
          <LoadingButton
            variant="contained"
            size="large"
            type="submit"
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </Stack>
      </Stack>
    </LoadingPlaceholderContainer>
  );
};
