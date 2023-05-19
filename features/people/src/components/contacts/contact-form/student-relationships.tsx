import {
  Button,
  Card,
  Grid,
  Typography,
  useTheme,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
} from '@mui/material';
import {
  StudentContactRelationshipInfoInput,
  StudentContactType,
} from '@tyro/api';
import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFSelect,
  RHFSwitch,
  usePreferredNameLayout,
} from '@tyro/core';
import {
  Control,
  UseFormGetValues,
  UseFormSetValue,
  useFieldArray,
} from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { AddIcon, ChevronDownIcon, TrashIcon } from '@tyro/icons';
import { useCallback } from 'react';
import {
  StudentSelectOption,
  useStudentsForSelect,
} from '../../../api/students';

const relationshipTypeOptions = Object.values(StudentContactType);
const priorityOptions = Array.from({ length: 5 }, (_v, k) => k + 1);

export type StudentRelationship = StudentContactRelationshipInfoInput & {
  student: StudentSelectOption;
  enableAll: boolean;
};

export type StudentRelationshipsFormState = {
  studentRelationships: StudentRelationship[];
};

type StudentRelationshipsProps<TField extends StudentRelationshipsFormState> = {
  getValues: TField extends StudentRelationshipsFormState
    ? UseFormGetValues<TField>
    : never;
  setValue: TField extends StudentRelationshipsFormState
    ? UseFormSetValue<TField>
    : never;
  control: TField extends StudentRelationshipsFormState
    ? Control<TField>
    : never;
};

export const StudentRelationships = <
  TField extends StudentRelationshipsFormState
>({
  control,
  getValues,
  setValue,
}: StudentRelationshipsProps<TField>) => {
  const { t } = useTranslation(['common', 'people']);
  const { spacing } = useTheme();

  const { data: studentsData = [] } = useStudentsForSelect({});
  const { displayName } = usePreferredNameLayout();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'studentRelationships',
  });

  const CUSTOM_SETTINGS: Array<{
    keyName: keyof StudentContactRelationshipInfoInput;
    label: string;
  }> = [
    {
      label: t('people:allowedToContact'),
      keyName: 'allowedToContact',
    },
    {
      label: t('people:legalGuardian'),
      keyName: 'legalGuardian',
    },
    {
      label: t('people:pickupPermission'),
      keyName: 'pickupRights',
    },
    {
      label: t('people:allowAccessToStudentData'),
      keyName: 'allowAccessToStudentData',
    },
    {
      label: t('people:includeInSms'),
      keyName: 'includeInSms',
    },
    {
      label: t('people:includeInTmail'),
      keyName: 'includeInTmail',
    },
  ];

  const updateContactSettings = useCallback(
    (index: number, checked: boolean) => {
      CUSTOM_SETTINGS.map(({ keyName }) => keyName).forEach((keyName) => {
        setValue(`studentRelationships.${index}.${keyName}`, checked);
      });
    },
    [setValue, CUSTOM_SETTINGS]
  );

  const updateEnableAll = useCallback(
    (index: number) => {
      const state = getValues(`studentRelationships.${index}`);

      const enabled = CUSTOM_SETTINGS.map(({ keyName }) => keyName).every(
        (keyName) => !!state[keyName]
      );

      setValue(`studentRelationships.${index}.enableAll`, enabled);
    },
    [setValue, CUSTOM_SETTINGS]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          variant="body1"
          component="h2"
          color="text.secondary"
          fontWeight={600}
        >
          {t('people:studentRelationshipsRequired')}
        </Typography>
      </Grid>
      {fields.map((field, index) => (
        <Grid key={field.id} item xs={12}>
          <Card variant="outlined">
            <CardHeader
              component="h3"
              title={`${t('common:student')} ${index + 1}`}
              sx={{
                m: 0,
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
            <Grid container spacing={2} p={2}>
              <Grid item xs={12} sm={12} md={6}>
                <RHFAutocomplete<
                  StudentRelationshipsFormState,
                  StudentSelectOption,
                  true
                >
                  fullWidth
                  freeSolo
                  label={t('common:student')}
                  options={studentsData}
                  optionIdKey="partyId"
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : displayName(option)
                  }
                  renderAvatarAdornment={(value, renderAdornment) =>
                    renderAdornment({
                      name: displayName(value),
                      src: value.avatarUrl,
                    })
                  }
                  renderAvatarOption={(option, renderOption) =>
                    renderOption({
                      name: displayName(option),
                      src: option.avatarUrl,
                    })
                  }
                  controlProps={{
                    name: `studentRelationships.${index}.student`,
                    control,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFSelect<StudentRelationshipsFormState, StudentContactType>
                  fullWidth
                  label={t('people:relationshipToStudent')}
                  options={relationshipTypeOptions}
                  getOptionLabel={(option) =>
                    t(`common:relationshipType.${option}`)
                  }
                  controlProps={{
                    name: `studentRelationships.${index}.relationshipType`,
                    control,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <RHFSelect
                  label={t('people:priority')}
                  fullWidth
                  options={priorityOptions}
                  getOptionLabel={(option) => String(option)}
                  controlProps={{
                    name: `studentRelationships.${index}.priority`,
                    control,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <CardHeader
                  component="h3"
                  title={t('people:contactSettings')}
                  sx={{
                    p: 0,
                    m: 0,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  component="p"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {t('people:contactSettingsDescription')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Accordion
                  defaultExpanded
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: spacing(1),
                    '&.MuiAccordion-root:before': {
                      content: 'none',
                    },
                    '&.Mui-expanded': {
                      m: 0,
                      boxShadow: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    aria-controls={`contactSettings.${index}`}
                    id={`contactSettings.${index}`}
                    expandIcon={<ChevronDownIcon />}
                    sx={{
                      paddingRight: spacing(3),
                    }}
                  >
                    <RHFCheckbox
                      label={t('common:enableAll')}
                      controlLabelProps={{
                        sx: {
                          width: '100%',
                          ml: 0,
                          '& .MuiFormControlLabel-label': {
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                          },
                        },
                        onClick: (e) => e.stopPropagation(),
                      }}
                      checkboxProps={{
                        color: 'primary',
                        onChange: (_event, checked) =>
                          updateContactSettings(index, checked),
                      }}
                      controlProps={{
                        name: `studentRelationships.${index}.enableAll`,
                        control,
                      }}
                    />
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      backgroundColor: 'slate.50',
                    }}
                  >
                    <Stack>
                      {CUSTOM_SETTINGS.map(({ label, keyName }) => (
                        <RHFSwitch
                          key={keyName}
                          label={label}
                          switchProps={{
                            color: 'primary',
                            onChange: () => updateEnableAll(index),
                          }}
                          controlLabelProps={{
                            labelPlacement: 'start',
                            sx: {
                              justifyContent: 'space-between',
                            },
                          }}
                          controlProps={{
                            name: `studentRelationships.${index}.${keyName}`,
                            control,
                          }}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} width="fit-content">
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={() => append({} as StudentRelationship)}
          startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
        >
          {t('people:addStudentRelationship')}
        </Button>
      </Grid>
    </Grid>
  );
};
