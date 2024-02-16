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
  useDebouncedValue,
  useDisclosure,
  useFormValidator,
  useToast,
} from '@tyro/core';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import {
  Options_SaveSubjectSet,
  queryClient,
  useAcademicNamespace,
} from '@tyro/api';
import { StudentSelection } from './student-selection';
import { SubjectOptionsFormState } from './types';
import { useSaveSubjectOptionsSetup } from '../../api/save-options-setup';
import { defaultSubjectSetProps, SubjectSets } from './subject-sets';
import { ReturnTypeFromUseOptionsSetup } from '../../api/options';
import { optionsKeys } from '../../api/keys';
import {
  ConfirmOptionSaveDialog,
  ConfirmOptionSaveDialogProps,
} from './confirm-save-dialog';

interface SubjectOptionsSetupFormProps {
  defaultOptionsSetup?: ReturnTypeFromUseOptionsSetup;
}

export function SubjectOptionsSetupForm({
  defaultOptionsSetup,
}: SubjectOptionsSetupFormProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const { activeAcademicNamespace } = useAcademicNamespace();
  const { toast } = useToast();
  const {
    isOpen: isCancelModalOpen,
    onClose: onCancelModalClose,
    onOpen: onCancelModalOpen,
  } = useDisclosure();
  const {
    value: changesToConfirm,
    debouncedValue: debouncedChangesToConfirm,
    setValue: setChangesToConfirm,
  } = useDebouncedValue<ConfirmOptionSaveDialogProps['changeInfo']>({
    defaultValue: null,
  });
  const navigate = useNavigate();
  const { mutateAsync: saveOptionsSetup, isLoading: isSubmitting } =
    useSaveSubjectOptionsSetup();

  const { rules, resolver } = useFormValidator<SubjectOptionsFormState>();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<SubjectOptionsFormState>({
    resolver: resolver({
      name: rules.required(),
      academicYearId: rules.required(),
      yearGroupId: rules.required(),
      selectedStudents: rules.required(),
      pools: {
        subjectSets: {
          name: rules.required(),
          canChoose: [
            rules.required(),
            rules.isNumber(),
            rules.min(1),
            rules.validate<number>(
              (value, throwError, formValues, fieldName) => {
                const pathToCurrentSubjectSet = fieldName.substring(
                  0,
                  fieldName.lastIndexOf('.')
                );
                const { subjects } = get(
                  formValues,
                  pathToCurrentSubjectSet
                ) as SubjectOptionsFormState['pools'][number]['subjectSets'][number];
                if (value > subjects.length) {
                  return throwError(
                    t('subjectOptions:mustChooseCannotBeGreaterThanSubjects')
                  );
                }
              }
            ),
          ],
          mustGet: [
            rules.required(),
            rules.isNumber(),
            rules.min(1),
            rules.validate<number>(
              (value, throwError, formValues, fieldName) => {
                const pathToCurrentSubjectSet = fieldName.substring(
                  0,
                  fieldName.lastIndexOf('.')
                );
                const { canChoose } = get(
                  formValues,
                  pathToCurrentSubjectSet
                ) as SubjectOptionsFormState['pools'][number]['subjectSets'][number];
                if (value > canChoose!) {
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
      },
    }),
    defaultValues: {
      pools: [
        {
          poolIdx: 1,
          subjectSets: [
            {
              ...defaultSubjectSetProps,
            },
          ],
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
    name: 'pools',
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
    ({ name, selectedStudents, pools, yearGroupId }) => {
      const subjectSets = pools.reduce<Options_SaveSubjectSet[]>(
        (acc, pool) => {
          pool.subjectSets.forEach((subjectSet) => {
            acc.push({
              ...subjectSet,
              canChoose: subjectSet.canChoose!,
              mustGet: subjectSet.mustGet!,
              poolIdx: pool.poolIdx,
              subjectIds: subjectSet.subjects.map(({ id }) => id),
            });
          });
          return acc;
        },
        []
      );

      const optionsSetupInput = {
        id: defaultOptionsSetup?.id,
        name,
        yearGroupId,
        studentPartyIds: selectedStudents.map(({ partyId }) => partyId),
        subjectSets,
      };

      saveOptionsSetup(
        {
          ...optionsSetupInput,
          validate: true,
        },
        {
          onSuccess: async ({ options_saveOptions }) => {
            if (options_saveOptions.validations?.length) {
              setChangesToConfirm({
                changes: optionsSetupInput,
                validations: options_saveOptions.validations,
              });
            } else {
              await queryClient.invalidateQueries(optionsKeys.all);
              toast(
                defaultOptionsSetup?.id
                  ? t('common:snackbarMessages.updateSuccess')
                  : t('common:snackbarMessages.createSuccess')
              );
              goBack();
            }
          },
        }
      );
    }
  );

  useEffect(() => {
    if (defaultOptionsSetup) {
      const pools = defaultOptionsSetup.subjectSets.reduce<
        SubjectOptionsFormState['pools']
      >((acc, subjectSet) => {
        if (typeof subjectSet.poolIdx !== 'number') return acc;

        if (!acc[subjectSet.poolIdx]) {
          acc[subjectSet.poolIdx] = {
            poolIdx: subjectSet.poolIdx,
            subjectSets: [],
          };
        }

        acc[subjectSet.poolIdx].subjectSets.push({
          idx: subjectSet.id.idx,
          name: subjectSet.name,
          canChoose: subjectSet.canChoose,
          mustGet: subjectSet.mustGet,
          subjects: subjectSet.subjects,
        });

        return acc;
      }, []);

      reset({
        name: defaultOptionsSetup.name,
        yearGroupId: defaultOptionsSetup.yearGroup.yearGroupId,
        selectedStudents: defaultOptionsSetup.students ?? [],
        pools,
        academicYearId: activeAcademicNamespace?.academicNamespaceId,
      });
    }
  }, [defaultOptionsSetup, activeAcademicNamespace, reset]);

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
              <Card
                variant="soft"
                key={pool.id}
                sx={{ p: 0, boxShadow: 'none' }}
              >
                <CardHeader
                  component="h4"
                  title={t('subjectOptions:poolN', { number: index + 1 })}
                  sx={{
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
                <SubjectSets poolIndex={index} control={control} />
              </Card>
            ))}
            {/* <Stack width="fit-content">
              <Button
                size="small"
                color="primary"
                variant="text"
                onClick={() =>
                  append({
                    poolIdx: subjectPools.length,
                    subjectSets: [
                      {
                        ...defaultSubjectSetProps,
                        idx: 0,
                      },
                    ],
                  })
                }
                startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
              >
                {t('subjectOptions:addPool')}
              </Button>
            </Stack> */}
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
      <ConfirmOptionSaveDialog
        changeInfo={changesToConfirm ?? debouncedChangesToConfirm}
        open={!!changesToConfirm}
        onClose={() => setChangesToConfirm(null)}
        goBack={goBack}
      />
    </>
  );
}
