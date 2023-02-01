/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Button, DialogActions, List, ListItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from '@tyro/i18n';
// components
import { RHFCheckbox } from '../../../../src/components/hook-form';
import { useAssignLabel } from '../api/labels';
import { MailLabel } from '../types';
// ----------------------------------------------------------------------

interface FormValuesProps {
  [key: string]: boolean;
}

type ApplyLabelsFormProps = {
  labels: MailLabel[];
  onCancel: VoidFunction;
  mailData: {
    threadId: number;
    mailId: number;
  };
};

const getInitialValues = (labels: MailLabel[]) => {
  const result = labels.map((label) => ({
    [`${label?.originalId ?? 0}`]: false,
  }));
  return result.reduce((prev, next) => ({ ...prev, ...next }), {});
};

export default function ApplyLabelsForm({
  mailData,
  labels,
  onCancel,
}: ApplyLabelsFormProps) {
  const { t } = useTranslation(['common']);
  const { enqueueSnackbar } = useSnackbar();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    defaultValues: getInitialValues(labels),
  });

  const { mutate: assignLabel } = useAssignLabel();

  const onSubmit = (data: FormValuesProps) => {
    try {
      Object.entries(data)
        .filter((item) => item.includes(true))
        .forEach((label) => {
          assignLabel({ ...mailData, labelId: +label[0] });
        });
      enqueueSnackbar(t('common:snackbarMessages.labelWasAssigned'));
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <List>
        {labels.map((label) => (
          <ListItem key={`list-${label.id}`}>
            <RHFCheckbox
              name={label.originalId?.toString() || ''}
              label={label.name.toString()}
              // @ts-ignore
              customControl={control}
            />
          </ListItem>
        ))}
      </List>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {t('common:actions.cancel')}
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {t('common:actions.apply')}
        </LoadingButton>
      </DialogActions>
    </form>
  );
}
