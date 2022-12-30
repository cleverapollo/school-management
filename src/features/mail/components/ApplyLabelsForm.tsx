import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, DialogActions, List, ListItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFCheckbox } from '../../../components/hook-form';
import { AssignLabelInput, Label, Maybe } from '@tyro/api';
import { useEffect, useState } from 'react';
import { useAssignLabel } from '../api/labels';
import { MailLabel } from '../types';
// ----------------------------------------------------------------------

interface FormValuesProps {
  [key: string]: boolean;
};

type IProps = {
  activeLabels?: Maybe<Maybe<Label>[]>;
  labels: MailLabel[];
  onCancel: VoidFunction;
  mailData: {
    threadId: string;
    mailId: string;
  }
};

const getInitialValues = (labels: MailLabel[], activeLabels?: Maybe<Maybe<Label>[]>) => {
  const result = labels.map(label => { 
    return {
      [`${label?.originalId}`]: !!activeLabels?.filter(activeLabel => activeLabel?.id === label.originalId).length ?? false 
    };
  });
  return result.reduce((prev, next) => ({...prev, ...next}), {});
}

export default function ApplyLabelsForm({ mailData, activeLabels, labels, onCancel }: IProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [assignLabelData, setAssignLabelData] = useState<AssignLabelInput | null>(null);

  const EventSchema = Yup.object().shape({
    activeLabelIds: Yup.array().min(1, 'You should add minimum 1 label'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(labels, activeLabels),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const mutation = useAssignLabel(assignLabelData ?? {} as AssignLabelInput);
  useEffect(() => {
    if (assignLabelData) {
      mutation.mutate();
      enqueueSnackbar('Label was assigned!');
      onCancel();
      reset();
    }
  }, [assignLabelData]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setAssignLabelData({ 
        ...mailData,
        labelId: +Object.entries(data).filter(item => item.includes(true))[0][0]
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <List>
        {labels.map(label => {
          return <ListItem key={`list-${label.id}`}>
            <RHFCheckbox
              name={label.originalId?.toString() || ''}
              label={label.name.toString()}
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
    </FormProvider>
  );
}
