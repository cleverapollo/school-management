import { Stack } from '@mui/material';
import { Forms_FormView } from '@tyro/api';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { FieldGroup } from './group';

export interface DynamicFormProps<Fields extends FieldValues> {
  formSettings: Forms_FormView;
  onSubmit: (data: Fields) => Promise<{
    success: boolean;
    errors?: { [key in keyof Fields]?: string };
  }>;
}

export const DynamicForm = <Fields extends FieldValues>({
  formSettings,
  onSubmit,
}: DynamicFormProps<Fields>) => {
  const { control, handleSubmit, setError } = useForm<Fields>();

  const requestSubmit = async (data: Fields) => {
    const { success, errors } = await onSubmit(data);
    if (!success && errors) {
      Object.entries(errors).forEach(([field, error]) => {
        setError(field as Path<Fields>, { message: error });
      });
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(requestSubmit)} gap={3}>
      {formSettings?.fields?.map((fieldGroup) => (
        <FieldGroup
          key={fieldGroup?.header}
          group={fieldGroup}
          control={control}
        />
      ))}
    </Stack>
  );
};
