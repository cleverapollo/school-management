import { Path, FieldValues, Control } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { RHFAutocomplete } from '@tyro/core';
import { useCommentBank, CommentBankOption } from '../../api/comment-bank';

type CommentBankOptionsProps<TField extends FieldValues> = {
  name: Path<TField>;
  control: Control<TField>;
};

export const CommentBankOptions = <TField extends FieldValues>({
  name,
  control,
}: CommentBankOptionsProps<TField>) => {
  const { t } = useTranslation(['assessments']);
  const { data: commentBankData = [] } = useCommentBank({});

  return (
    <RHFAutocomplete<TField, CommentBankOption>
      label={t('assessments:labels.commentBankOptions')}
      optionIdKey="id"
      optionTextKey="name"
      controlProps={{ name, control }}
      sx={{
        maxWidth: 300,
        width: '100%',
      }}
      options={commentBankData}
    />
  );
};
