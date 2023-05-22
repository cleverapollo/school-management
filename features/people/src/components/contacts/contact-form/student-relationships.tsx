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
import {
  AddIcon,
  ChevronDownIcon,
  InfoCircleIcon,
  TrashIcon,
} from '@tyro/icons';
import { useCallback, useState } from 'react';
import {
  StudentSelectOption,
  useStudentsForSelect,
} from '../../../api/student/students';

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

type CustomSettings = {
  keyName: keyof StudentContactRelationshipInfoInput;
  label: string;
  disabled: boolean;
  tooltipText?: string;
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'studentRelationships',
  });

  const { data: studentsData = [] } = useStudentsForSelect({});
  const { displayName } = usePreferredNameLayout();
  const [isPartiallyEnabled, setIsPartiallyEnabled] = useState<
    boolean | undefined
  >();

  const [customSettings, setCustomSettings] = useState<CustomSettings[]>([
    {
      label: t('people:legalGuardian'),
      keyName: 'legalGuardian',
      disabled: false,
    },
    {
      label: t('people:pickupPermission'),
      keyName: 'pickupRights',
      disabled: false,
    },
    {
      label: t('people:allowAccessToStudentData'),
      keyName: 'allowAccessToStudentData',
      disabled: false,
    },
    {
      label: t('people:allowedToContact'),
      keyName: 'allowedToContact',
      disabled: false,
    },
    {
      label: t('people:includeInSms'),
      keyName: 'includeInSms',
      disabled: true,
      tooltipText: t('people:allowedToContactRequired'),
    },
    {
      label: t('people:includeInTmail'),
      keyName: 'includeInTmail',
      disabled: true,
      tooltipText: t('people:allowedToContactRequired'),
    },
  ]);

  const handleEnableContactPermissions = useCallback(
    (index: number, enable: boolean) => {
      setCustomSettings(
        customSettings.map((settings) => ({
          ...settings,
          ...(settings.keyName === 'includeInSms' && {
            disabled: !enable,
          }),
          ...(settings.keyName === 'includeInTmail' && {
            disabled: !enable,
          }),
        }))
      );

      if (!enable) {
        setValue(`studentRelationships.${index}.includeInSms`, false);
        setValue(`studentRelationships.${index}.includeInTmail`, false);
      }
    },
    [setValue, customSettings, setCustomSettings]
  );

  const handlePartiallyEnabled = useCallback(
    (index: number) => {
      const state = getValues(`studentRelationships.${index}`);
      const partial = customSettings.filter(({ keyName }) => !!state[keyName]);
      const enabledAll = partial.length === customSettings.length;

      setValue(`studentRelationships.${index}.enableAll`, enabledAll);
      setIsPartiallyEnabled(enabledAll ? undefined : partial.length > 0);
    },
    [getValues, customSettings, setValue, setIsPartiallyEnabled]
  );

  const updateContactSettings = useCallback(
    (
      index: number,
      currentKeyName: keyof StudentContactRelationshipInfoInput,
      checked: boolean
    ) => {
      setValue(`studentRelationships.${index}.${currentKeyName}`, checked);

      if (currentKeyName === 'allowedToContact') {
        handleEnableContactPermissions(index, checked);
      }

      handlePartiallyEnabled(index);
    },
    [setValue, handlePartiallyEnabled, handleEnableContactPermissions]
  );

  const updateEnableAll = useCallback(
    (index: number, checked: boolean) => {
      setValue(`studentRelationships.${index}.enableAll`, checked);

      customSettings.forEach(({ keyName }) => {
        setValue(`studentRelationships.${index}.${keyName}`, checked);
        if (keyName === 'allowedToContact') {
          handleEnableContactPermissions(index, checked);
        }
      });

      setIsPartiallyEnabled(checked ? undefined : checked);
    },
    [
      setValue,
      customSettings,
      setIsPartiallyEnabled,
      handleEnableContactPermissions,
    ]
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
                      label={
                        isPartiallyEnabled
                          ? t('common:partiallyEnabled')
                          : t('common:enableAll')
                      }
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
                        indeterminate: isPartiallyEnabled,
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
                    <Stack>
                      {customSettings.map(
                        ({ label, keyName, disabled, tooltipText }) => (
                          <Tooltip
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
                                key={keyName}
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
                                  onChange: (_event, checked) =>
                                    updateContactSettings(
                                      index,
                                      keyName,
                                      checked
                                    ),
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
