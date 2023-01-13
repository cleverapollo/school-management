import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Button, DialogActions, List, ListItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { RHFCheckbox } from '../../../components/hook-form';
import { useAssignLabel } from '../api/labels';
import { MailLabel } from '../types';
// ----------------------------------------------------------------------

interface FormValuesProps {
  [key: string]: boolean;
};

type ApplyLabelsFormProps = {
  labels: MailLabel[];
  onCancel: VoidFunction;
  mailData: {
    threadId: string;
    mailId: string;
  }
};

const getInitialValues = (labels: MailLabel[]) => {
  const result = labels.map(label => { 
    return {
      [`${label?.originalId}`]: false,
    };
  });
  return result.reduce((prev, next) => ({...prev, ...next}), {});
}

export default function ApplyLabelsForm({ mailData, labels, onCancel }: ApplyLabelsFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    defaultValues: getInitialValues(labels)
  });

  const { mutate: assignLabel } = useAssignLabel();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      Object.entries(data).filter(item => item.includes(true)).forEach(async (label) => {
        assignLabel({...mailData, labelId: +label[0]});
      });
      enqueueSnackbar('Label was assigned!');
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <List>
        {labels.map(label => {
          return <ListItem key={`list-${label.id}`}>
            <RHFCheckbox
              name={label.originalId?.toString() || ''}
              label={label.name.toString()}
              customControl={control}
            />
          </ListItem>
        })}
      </List>

      <DialogActions>

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Apply
        </LoadingButton>
      </DialogActions>
    </form>
  );
}
