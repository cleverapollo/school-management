import {
  Button,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Stack,
  Chip,
  Grid,
} from '@mui/material';
import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import {
  CreateCalendarEventInput,
  getColorBasedOnIndex,
  usePermissions,
} from '@tyro/api';
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
  'Application to NCSE for Additional Teaching Support and/or SNA Support.',
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
  console.log(initialState);
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
  console.log(initialState);
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
      <DialogTitle>
        {initialState?.id ? t('people:editNote') : t('people:addNote')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack gap={3} p={3}>
            <Stack direction="row" gap={2}>
              <RHFSelect
                label={t('people:aen.type')}
                options={aenTypes}
                sx={{ width: '100%' }}
                getOptionLabel={(option) => option}
                controlProps={{
                  name: 'type',
                  control,
                }}
              />
            </Stack>

            <Stack direction="row" gap={2}>
              <RHFTextField
                label={t('people:aen.contact')}
                controlProps={{
                  name: 'contact',
                  control,
                }}
              />
              <RHFTextField
                label={t('people:aen.snaSupport')}
                controlProps={{
                  name: 'snaSupport',
                  control,
                }}
              />
            </Stack>
            <Stack direction="row" gap={2}>
              <RHFTextField
                label={t('people:aen.provision')}
                controlProps={{
                  name: 'provision',
                  control,
                }}
              />
              <RHFTextField
                label={t('people:aen.typeNote')}
                controlProps={{
                  name: 'typeNote',
                  control,
                }}
              />
            </Stack>
            <Stack direction="row" gap={2}>
              <RHFDatePicker
                label={t('people:aen.startDate')}
                controlProps={{
                  name: 'startDate',
                  control,
                }}
              />
              <RHFDatePicker
                label={t('people:aen.endDate')}
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
