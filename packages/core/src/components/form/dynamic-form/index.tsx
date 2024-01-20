import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, Button, Stack } from '@mui/material';
import {
  Forms_FormView,
  Forms_SubmitFormInput,
  Forms_SubmitFormResponse,
} from '@tyro/api';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useMemo, useState, useRef } from 'react';
import { LoadingPlaceholderContainer } from '../../loading-placeholder';
import { FieldGroup } from './group';

export interface DynamicFormProps {
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
}: DynamicFormProps) => {
  const globalErrorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(['common']);
  const { control, handleSubmit, setError } = useForm<Fields>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  const sortedFieldIds = useMemo(() => {
    if (!formSettings) return [];
    return (
      formSettings.fields?.reduce<string[]>((acc, fieldGroup) => {
        fieldGroup.fields?.forEach((field) => {
          if (field.__typename === 'Forms_FormFieldItem') {
            acc.push(field.id);
          }

          if (field.__typename === 'Forms_FormFieldSubGroup') {
            field.fields?.forEach((subField) => {
              acc.push(subField.id);
            });
          }
        });
        return acc;
      }, []) ?? []
    );
  }, [formSettings]);

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
      const hasGlobalErrors = validations?.globalErrors?.length > 0;
      const typedErrors = validations?.fieldErrors as Record<string, string>;
      const sortedIdsWithErrors = sortedFieldIds.filter(
        (key) => typedErrors[key]
      );

      sortedIdsWithErrors.forEach((fieldId, index) => {
        const error = typedErrors[fieldId];
        setError(
          fieldId as Path<Fields>,
          { message: error },
          { shouldFocus: index === 0 && !hasGlobalErrors }
        );
      });

      setGlobalErrors(validations?.globalErrors ?? []);
      if (hasGlobalErrors) {
        globalErrorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <LoadingPlaceholderContainer isLoading={!formSettings}>
      <Stack component="form" onSubmit={handleSubmit(requestSubmit)} gap={3}>
        <Box ref={globalErrorRef}>
          {globalErrors.length > 0 && (
            <Alert severity="error">
              <AlertTitle>Please fix the following errors</AlertTitle>

              <Box component="ul" sx={{ m: 0, pl: '14px' }}>
                {globalErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </Box>
            </Alert>
          )}
        </Box>
        {formSettings?.fields?.map((fieldGroup) => (
          <FieldGroup
            key={fieldGroup?.header}
            group={fieldGroup}
            control={control}
          />
        ))}
        <Stack direction="row" gap={2} justifyContent="flex-end">
          {!!onCancel && (
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
