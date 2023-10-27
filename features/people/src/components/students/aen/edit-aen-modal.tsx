import { Button, Stack } from '@mui/material';
import {
  RHFDatePicker,
  RHFTextField,
  useFormValidator,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  RHFAutocomplete,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { useUpsertStudentAen } from '../../../api/student/aen/upsert-student-aen';
import { ReturnTypeFromUseStudentAen } from '../../../api/student/aen/student-aen-data';

type AenFormState = NonNullable<ReturnTypeFromUseStudentAen>['entries'][number];
export type EditAenModalProps = {
  initialState: Partial<AenFormState> | null;
  onClose: () => void;
  studentId: number;
};

const aenTypes = [
  'Anorexia',
  'Anxiety',
  'Aphasia',
  'Application to NCSE for Additional Teaching Support and/or ANA Support.',
  "Asperger's Syndrome",
  'Assessment Report on file',
  'Attention Deficit/Hyperactivity Disorder',
  'Auditory Processing Disorder',
  'Autistic Spectrum Disorder',
  'Behaviour, Emotional and Social Difficulties',
  'Borderline General Learning Disability',
  'Brain Injury',
  'Bulimia',
  'Cancer',
  'Cerebral Atrophy',
  'Cerebral Palsy',
  'Conduct Disorder',
  'Cystic Fibrosis',
  'Reasonable Accommodation granted for State Examinations',
  'Developmental Delay',
  'Down Syndrome',
  'Duane Syndrome',
  'Dyscalculia',
  'Dysgraphia',
  'Dyslexia',
  'Dyspraxia',
  'Echolalia',
  'Epilepsy',
  'Fine and Gross Motor Skill Delay',
  'Fragile X syndrome',
  'Global Developmental Delay',
  'Glue Ear',
  'Hearing Impairment',
  'High-Functioning Autism',
  'Hydrocephalus',
  'Irlen Syndrome',
  'Learning Difficulties',
  'Low Literacy Skills',
  'Mild General Learning Disability',
  'Moderate Learning Difficulty',
  'Multi-Sensory Impairment',
  'Multiple',
  'Muscular Dystrophy',
  'Note on file in fireproof cabinet (non-assessment).',
  'Obsessive Compulsive Disorder',
  'Oppositional Defiant Disorder',
  'Other',
  'Other Difficulty/Disability',
  'Pathological Demand Avoidance',
  'Pervasive Developmental Disorder',
  'Physical and Medical Difficulties',
  'Physical Disability',
  'Prader-Willi syndrome',
  'Profound and Multiple Learning Difficulty',
  'Reasonable Accommodation Application Forwarded to SEC',
  'Rett Syndrome',
  'Semantic Pragmatic Disorder',
  'Sensory Processing Disorder',
  'Severe Learning Difficulty',
  'Smith-Magenis syndrome',
  'Social Anxiety Disorder',
  'Social Skills Difficulties',
  'Sotos Syndrome',
  'Specific Learning Difficulty',
  'Speech, Language and Communication Needs',
  'Spina bifida',
  'SSP targets',
  'SWAN',
  'Tourette Syndrome',
  'Visual Impairment',
  'Visual Processing Disorder',
  'Worster-Drought Syndrome',
];

export const EditNoteModal = ({
  initialState,
  onClose,
  studentId,
}: EditAenModalProps) => {
  const { t } = useTranslation(['common', 'people']);
  const { mutate: upsertAenMutation, isLoading: isSubmitting } =
    useUpsertStudentAen();

  const { resolver, rules } = useFormValidator<AenFormState>();

  const { control, handleSubmit } = useForm<AenFormState>({
    defaultValues: {
      ...initialState,
      // @ts-ignore
      startDate: initialState?.startDate
        ? dayjs(initialState?.startDate)
        : null,
      // @ts-ignore
      endDate: initialState?.endDate ? dayjs(initialState?.endDate) : null,
    },
    resolver: resolver({}),
  });

  const onSubmit = handleSubmit(
    ({
      note,
      type,
      typeNote,
      provision,
      snaSupport,
      contact,
      startDate,
      endDate,
    }) => {
      upsertAenMutation(
        {
          id: initialState?.id,
          studentPartyId: studentId,
          note,
          type,
          typeNote,
          provision,
          snaSupport,
          contact,
          startDate,
          endDate,
        },
        {
          onSuccess: onClose,
        }
      );
    }
  );

  return (
    <Dialog
      open={!!initialState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>
        {initialState?.id ? t('people:editAen') : t('people:addAen')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <RHFAutocomplete
              fullWidth
              freeSolo
              autoSelect
              label={t('people:aen.type')}
              options={aenTypes}
              controlProps={{
                name: `type`,
                control,
              }}
              sx={{ mt: 1 }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField
                label={t('people:aen.contact')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'contact',
                  control,
                }}
              />
              <RHFTextField
                label={t('people:aen.anaSupport')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'snaSupport',
                  control,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField
                label={t('people:aen.provision')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'provision',
                  control,
                }}
              />
              <RHFTextField
                label={t('people:aen.typeNote')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'typeNote',
                  control,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFDatePicker
                label={t('people:aen.startDate')}
                inputProps={{ fullWidth: true }}
                controlProps={{
                  name: 'startDate',
                  control,
                }}
              />
              <RHFDatePicker
                label={t('people:aen.endDate')}
                inputProps={{ fullWidth: true }}
                controlProps={{
                  name: 'endDate',
                  control,
                }}
              />
            </Stack>
            <Stack>
              <RHFTextField
                label={t('people:aen.note')}
                controlProps={{
                  name: 'note',
                  control,
                }}
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  minRows: 3,
                  autoFocus: true,
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
