import { Path, FieldValues, Control } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { RHFTextField } from '@tyro/core';

type CommentLengthFieldProps<TField extends FieldValues> = {
  name: Path<TField>;
  control: Control<TField>;
};

export const CommentLengthField = <TField extends FieldValues>({
  name,
  control,
}: CommentLengthFieldProps<TField>) => {
  const { t } = useTranslation(['assessments']);

  return (
    <RHFTextField<TField>
      label={t('assessments:labels.commentLength')}
      textFieldProps={{
        sx: {
          maxWidth: 300,
          width: '100%',
        },
        type: 'number',
      }}
      controlProps={{ name, control }}
    />
  );
};
