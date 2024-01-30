import {
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  ConfirmDialog,
  RHFTextField,
  useDisclosure,
  useFormValidator,
} from '@tyro/core';
import { useFieldArray, useForm } from 'react-hook-form';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { RHFSubjectAutocomplete } from '@tyro/settings';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { StudentSelection } from './student-selection';
import { SubjectOptionsFormState } from './types';
import { useSaveSubjectOptionsSetup } from '../../api/save-options-setup';

const defaultPoolProps = {
  canChoose: 0,
  mustGet: 0,
  subjects: [],
};

export function SubjectOptionsSetupForm() {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const {
    isOpen: isCancelModalOpen,
    onClose: onCancelModalClose,
    onOpen: onCancelModalOpen,
  } = useDisclosure();
  const navigate = useNavigate();
  const { mutateAsync: saveOptionsSetup, isLoading: isSubmitting } =
    useSaveSubjectOptionsSetup();

  const { rules, resolver } = useFormValidator<SubjectOptionsFormState>();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<SubjectOptionsFormState>({
    resolver: resolver({
      name: rules.required(),
      academicYearId: rules.required(),
      yearGroupEnrolmentPartyId: rules.required(),
      selectedStudents: rules.required(),
      subjectSets: {
        canChoose: [rules.required(), rules.isNumber(), rules.min(1)],
        mustGet: [
          rules.required(),
          rules.isNumber(),
          rules.min(1),
          rules.validate<number>(
            (value, throwError, formValues, fieldArrayIndex) => {
              const { canChoose } = formValues.subjectSets[fieldArrayIndex!];
              if (value > canChoose) {
                return throwError(
                  t('subjectOptions:mustGetCannotBeGreaterThanCanChoose')
                );
              }
            }
          ),
        ],
        subjects: [
          rules.minLength(1, t('subjectOptions:mustSelectAtLeastOneSubject')),
        ],
      },
    }),
    defaultValues: {
      subjectSets: [
        {
          ...defaultPoolProps,
          poolIdx: 0,
        },
      ],
    },
  });
  const {
    fields: subjectPools,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'subjectSets',
  });

  const goBack = () => {
    navigate('/subject-options');
  };

  const handleCancelForm = () => {
    if (isDirty) {
      onCancelModalOpen();
    } else {
      goBack();
    }
  };

  const onSubmit = handleSubmit(
    ({ name, selectedStudents, subjectSets, yearGroupEnrolmentPartyId }) => {
      saveOptionsSetup(
        {
          name,
          yearGroupEnrolmentPartyId,
          studentPartyIds: selectedStudents.map(({ partyId }) => partyId),
          subjectSets: subjectSets.map(({ subjects, ...rest }) => ({
            subjectIds: subjects.map(({ id }) => id),
            ...rest,
          })),
        },
        {
          onSuccess: () => {
            goBack();
          },
        }
      );
    }
  );

  return (
    <>
      <Stack component="form" onSubmit={onSubmit} gap={3}>
        <Card variant="outlined">
          <CardHeader component="h2" title={t('common:details')} />
          <Stack direction="column" gap={3} p={3}>
            <Grid container spacing={2} maxWidth={900}>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  label={t('common:name')}
                  controlProps={{
                    name: 'name',
                    control,
                  }}
                  textFieldProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
            </Grid>
            <Typography
              variant="body1"
              component="h3"
              color="text.secondary"
              fontWeight={600}
            >
              {t('subjectOptions:studentSelection')}
            </Typography>

            <StudentSelection control={control} />
          </Stack>
        </Card>
        <Card variant="outlined">
          <CardHeader component="h2" title={t('subjectOptions:subjectSetup')} />
          <Stack direction="column" p={3} gap={2.5}>
            <Typography
              variant="body1"
              component="h3"
              color="text.secondary"
              fontWeight={600}
            >
              {t('subjectOptions:atLeastOneSubjectPoolRequired')}
            </Typography>
            {subjectPools.map((pool, index) => (
              <Card variant="outlined" key={pool.id}>
                <CardHeader
                  component="h4"
                  title={t('subjectOptions:poolN', { number: index + 1 })}
                  sx={{
                    pb: 0,
                    border: 0,
                  }}
                  action={
                    index === 0 ? null : (
                      <IconButton
                        color="primary"
                        aria-label={t('common:delete')}
                        onClick={() => remove(index)}
                      >
                        <TrashIcon />
                      </IconButton>
                    )
                  }
                />
                <Grid container spacing={2} p={3} maxWidth={900}>
                  <Grid item xs={12}>
                    <RHFSubjectAutocomplete
                      label={t('common:subjects')}
                      multiple
                      controlProps={{
                        name: `subjectSets.${index}.subjects`,
                        control,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      label={t('subjectOptions:canChooseLabel')}
                      controlProps={{
                        name: `subjectSets.${index}.canChoose`,
                        control,
                      }}
                      textFieldProps={{
                        fullWidth: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      label={t('subjectOptions:mustGetLabel')}
                      controlProps={{
                        name: `subjectSets.${index}.mustGet`,
                        control,
                      }}
                      textFieldProps={{
                        fullWidth: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}
            <Stack width="fit-content">
              <Button
                size="small"
                color="primary"
                variant="text"
                onClick={() =>
                  append({
                    ...defaultPoolProps,
                    poolIdx: subjectPools.length,
                  })
                }
                startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
              >
                {t('subjectOptions:addSubjectPool')}
              </Button>
            </Stack>
          </Stack>
        </Card>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button
            variant="soft"
            size="large"
            color="primary"
            onClick={handleCancelForm}
          >
            {t('common:actions.cancel')}
          </Button>
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
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={onCancelModalClose}
        onConfirm={goBack}
      />
    </>
  );
}
