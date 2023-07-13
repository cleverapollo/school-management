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
  Tooltip,
  Stack,
} from '@mui/material';
import {
  UpsertStudentContactRelationshipInfoInput,
  StudentContactType,
} from '@tyro/api';
import { RHFAutocomplete, RHFCheckbox, RHFSelect, RHFSwitch } from '@tyro/core';
import {
  Control,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import {
  AddIcon,
  ChevronDownIcon,
  InfoCircleIcon,
  TrashIcon,
} from '@tyro/icons';
import { useCallback, useEffect, useMemo } from 'react';
import {
  StudentSelectOption,
  useStudentsForSelect,
} from '../../../api/student/students';
import { usePeopleAutocompleteProps } from '../../common/use-people-autocomplete-props';

const relationshipTypeOptions = Object.values(StudentContactType);
export const priorityOptions = Array.from({ length: 5 }, (_v, k) => k + 1);

export type StudentRelationship = UpsertStudentContactRelationshipInfoInput & {
  student: StudentSelectOption;
  enableAll: boolean;
};

export type StudentRelationshipsFormState = {
  studentRelationships: StudentRelationship[];
};

type StudentRelationshipsProps<TField extends StudentRelationshipsFormState> = {
  setValue: TField extends StudentRelationshipsFormState
    ? UseFormSetValue<TField>
    : never;
  control: TField extends StudentRelationshipsFormState
    ? Control<TField>
    : never;
};

type CustomSettings = {
  keyName: keyof UpsertStudentContactRelationshipInfoInput;
  label: string;
  checked: boolean;
  disabled?: boolean;
  tooltipText?: string;
};

export const StudentRelationships = <
  TField extends StudentRelationshipsFormState
>({
  control,
  setValue,
}: StudentRelationshipsProps<TField>) => {
  const { t } = useTranslation(['common', 'people']);

  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<StudentSelectOption>();

  const { spacing } = useTheme();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'studentRelationships',
  });

  const { data: studentsData = [] } = useStudentsForSelect({});
  const { studentRelationships = [] } = useWatch({ control });

  const contactSettings = useMemo<CustomSettings[][]>(
    () =>
      studentRelationships.map(
        ({ allowedToContact, ...customSettingsFields }) => [
          {
            label: t('people:contactSettingsPermissions.legalGuardian'),
            keyName: 'legalGuardian',
            checked: Boolean(customSettingsFields.legalGuardian),
          },
          {
            label: t('people:contactSettingsPermissions.pickupPermission'),
            keyName: 'pickupRights',
            checked: Boolean(customSettingsFields.pickupRights),
          },
          {
            label: t(
              'people:contactSettingsPermissions.allowAccessToStudentData'
            ),
            keyName: 'allowAccessToStudentData',
            checked: Boolean(customSettingsFields.allowAccessToStudentData),
          },
          {
            label: t('people:contactSettingsPermissions.allowedToContact'),
            keyName: 'allowedToContact',
            checked: Boolean(allowedToContact),
          },
          {
            label: t('people:includeInSms'),
            keyName: 'includeInSms',
            checked: Boolean(customSettingsFields.includeInSms),
            disabled: !allowedToContact,
            tooltipText: t('people:allowedToContactRequired'),
          },
          {
            label: t('people:includeInTmail'),
            keyName: 'includeInTmail',
            checked: Boolean(customSettingsFields.includeInTmail),
            disabled: !allowedToContact,
            tooltipText: t('people:allowedToContactRequired'),
          },
        ]
      ),
    [t, studentRelationships]
  );

  const updateEnableAll = useCallback(
    (index: number, checked: boolean) => {
      setValue(`studentRelationships.${index}.enableAll`, checked);

      contactSettings[index].forEach(({ keyName }) => {
        setValue(`studentRelationships.${index}.${keyName}`, checked);
      });
    },
    [setValue, contactSettings]
  );

  useEffect(() => {
    contactSettings.forEach((custom, index) => {
      const enabledAll = custom.every(({ checked }) => checked);

      const allowedToContact = custom.find(
        ({ keyName }) => keyName === 'allowedToContact'
      );

      setValue(`studentRelationships.${index}.enableAll`, enabledAll);

      if (!allowedToContact?.checked) {
        setValue(`studentRelationships.${index}.includeInTmail`, false);
        setValue(`studentRelationships.${index}.includeInSms`, false);
      }
    });
  }, [setValue, contactSettings]);

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
            <Grid container spacing={3} p={3}>
              <Grid item xs={12} sm={12} md={6}>
                <RHFAutocomplete<
                  StudentRelationshipsFormState,
                  StudentSelectOption
                >
                  {...peopleAutocompleteProps}
                  fullWidth
                  label={t('common:student')}
                  options={studentsData}
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
                <Typography
                  component="h3"
                  variant="h6"
                  sx={{
                    mb: 1,
                  }}
                >
                  {t('people:contactSettings')}
                </Typography>
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
                        indeterminate: studentRelationships[index]?.enableAll
                          ? undefined
                          : contactSettings[index]?.some(
                              ({ checked }) => checked
                            ),
                        color: 'primary',
                        onChange: (_event, checked) =>
                          updateEnableAll(index, checked),
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
                    <Stack gap={1}>
                      {contactSettings[index]?.map(
                        ({ label, keyName, disabled, tooltipText }) => (
                          <Tooltip
                            key={`${index}-${keyName}`}
                            title={disabled ? tooltipText : ''}
                            describeChild
                            placement="top-end"
                            PopperProps={{
                              sx: {
                                '& .MuiTooltip-tooltip': {
                                  marginBottom: '0 !important',
                                },
                              },
                            }}
                          >
                            <Stack>
                              <RHFSwitch
                                label={
                                  disabled ? (
                                    <Stack direction="row" gap={0.5}>
                                      {label}
                                      {tooltipText && (
                                        <InfoCircleIcon
                                          sx={{ width: 18, height: 18 }}
                                        />
                                      )}
                                    </Stack>
                                  ) : (
                                    label
                                  )
                                }
                                switchProps={{
                                  color: 'primary',
                                }}
                                controlLabelProps={{
                                  disabled,
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
                            </Stack>
                          </Tooltip>
                        )
                      )}
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
