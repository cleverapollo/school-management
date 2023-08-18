import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
} from '@mui/material';
import {
  RHFDatePicker,
  RHFSelect,
  RHFSelectionList,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';

export interface CreateBehaviourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateBehaviourFormState) => void;
}

// For testing only
export enum Category {
  Positive = 'POSITIVE',
  Negative = 'NEGATIVE',
  Neutral = 'NEUTRAL',
}

const SUBJECTS = ['Maths', 'History', 'English', 'Lunchtime'];

export type CreateBehaviourFormState = {
  behaviour: string;
  category: Category;
  details: string;
  subjects: string[];
  outcome: string;
  occurredOn: Date;
};

export function CreateBehaviourModal({
  isOpen,
  onClose,
  onCreate,
}: CreateBehaviourModalProps) {
  const { t } = useTranslation(['common', 'people']);

  const { resolver, rules } = useFormValidator<CreateBehaviourFormState>();

  const { control, handleSubmit, reset } = useForm<CreateBehaviourFormState>({
    resolver: resolver({
      behaviour: rules.required(),
      category: rules.required(),
      occurredOn: rules.required(),
    }),
    mode: 'onChange',
  });

  const onSubmit = (data: CreateBehaviourFormState) => {
    onCreate(data);
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('people:createBehaviour')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3} p={3}>
          <Stack direction="row" gap={2} gridColumn={2}>
            <RHFTextField<CreateBehaviourFormState>
              label={t('people:behaviour')}
              controlProps={{
                name: 'behaviour',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFSelect<CreateBehaviourFormState, Category>
              fullWidth
              options={Object.values(Category)}
              label={t('people:category')}
              getOptionLabel={(option) => option}
              controlProps={{
                name: 'category',
                control,
              }}
            />
          </Stack>
          <Stack direction="column" gap={2}>
            <RHFTextField<CreateBehaviourFormState>
              label={t('common:details')}
              controlProps={{
                name: 'details',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFSelectionList<CreateBehaviourFormState>
              fullWidth
              options={SUBJECTS}
              label={t('people:associated')}
              getOptionLabel={(option) => option}
              controlProps={{
                name: 'subjects',
                control,
              }}
            />
            <RHFTextField<CreateBehaviourFormState>
              label={t('people:outcome')}
              controlProps={{
                name: 'outcome',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
              }}
            />
            <RHFDatePicker<CreateBehaviourFormState>
              label={t('people:occurredOn')}
              controlProps={{
                name: 'occurredOn',
                control,
              }}
            />
          </Stack>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained">
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
