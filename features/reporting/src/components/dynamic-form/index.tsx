import { useTranslation } from '@tyro/i18n';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useFormValidator,
  useDisclosure,
} from '@tyro/core';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useMemo, useState } from 'react';
import {
  Reporting_GroupBy,
  Reporting_TableFilter,
  Reporting_TableFilterInput,
  Reporting_TableFilterType,
  Reporting_TableFilterValues,
  Reporting_TableMetric,
  Reporting_TimeGroupBy,
} from '@tyro/api';
import dayjs, { Dayjs } from 'dayjs';
import {
  ChevronUpIcon,
  DataOneToThreePipeIcon,
  InfoCircleIcon,
} from '@tyro/icons';
import { DynamicControl } from './control';

type DynamicFormProps = {
  isFetching: boolean;
  filters: Reporting_TableFilter[];
  onValueChange: (value: {
    filters: Reporting_TableFilterInput[];
    metric?: string;
    groupings?: string[];
    timeGrouping?: string;
  }) => void;
  sql?: string | null;
  isInteractiveReport?: boolean;
  preFilterFields?: {
    stats?: Reporting_TableMetric | null;
  };
  groupingFields?: {
    groupBy?: Reporting_GroupBy | null;
    timeGroupBy?: Reporting_TimeGroupBy | null;
  };
};

type FormState = { [id: Reporting_TableFilter['id']]: any };

const getValueFormat = (
  formValue: any,
  inputType: Reporting_TableFilterType
) => {
  switch (inputType) {
    case Reporting_TableFilterType.Checkbox:
      return Boolean(formValue);
    case Reporting_TableFilterType.MultiSelect: {
      const selectedValue = formValue as Reporting_TableFilterValues[];
      return selectedValue?.map((value) => value.id as number);
    }
    case Reporting_TableFilterType.Select: {
      return formValue as number;
    }
    case Reporting_TableFilterType.Date:
      return dayjs(formValue as dayjs.Dayjs).format('YYYY-MM-DD');
    case Reporting_TableFilterType.InputNumber:
      return Number(formValue);
    case Reporting_TableFilterType.Input:
    default:
      return String(formValue);
  }
};

export const DynamicForm = ({
  isFetching,
  filters,
  onValueChange,
  sql,
  isInteractiveReport = false,
  preFilterFields,
  groupingFields,
}: DynamicFormProps) => {
  const { t } = useTranslation(['common', 'reports']);
  const [openSqlDialog, setOpenSqlDialog] = useState(false);
  const {
    id: groupingId,
    isOpen: isGroupingOpen,
    onToggle: onToggleGrouping,
  } = useDisclosure();

  const { resolver, rules } = useFormValidator();

  const resolverFields = useMemo(
    () =>
      resolver(
        filters
          .filter((field) => field.required)
          .reduce(
            (keys, field) => ({
              ...keys,
              [field.id]: [
                rules.required(),
                ...(field.inputType === Reporting_TableFilterType.Date
                  ? [
                      rules.date(),
                      rules.validate((value, throwError) => {
                        if (
                          (field.minValue &&
                            (value as Dayjs).isBefore(
                              dayjs(field.minValue as string)
                            )) ||
                          (field.maxValue &&
                            (value as Dayjs).isAfter(
                              dayjs(field.maxValue as string)
                            ))
                        ) {
                          throwError(t('common:errorMessages.invalidDate'));
                        }
                      }),
                    ]
                  : []),
              ],
            }),
            {}
          )
      ),
    [filters]
  );

  const { control, handleSubmit } = useForm<FormState>({
    resolver: resolverFields,
  });

  const onSubmit = handleSubmit(
    ({ groupBy, timeGroupBy, metric, ...formData }) => {
      console.log('--------');
      console.log(metric);
      onValueChange({
        filters: filters.map<Reporting_TableFilterInput>((filter) => ({
          filterId: filter.id,
          filterValue: getValueFormat(formData[filter.id], filter.inputType),
        })),
        metric: metric as string | undefined,
        groupings: groupBy ? [groupBy] : undefined,
        timeGrouping: timeGroupBy as string | undefined,
      });
    }
  );

  const handleCloseDialog = () => {
    setOpenSqlDialog(false);
  };

  return filters.length > 0 ? (
    <Stack
      component="form"
      gap={2}
      flexDirection="row"
      alignItems="flex-start"
      flexWrap="wrap"
      onSubmit={onSubmit}
    >
      {preFilterFields?.stats && (
        <Stack flexDirection="row">
          <DynamicControl
            control={control}
            filter={{
              id: 'metric',
              inputType: Reporting_TableFilterType.Select,
              label: t('reports:metric'),
              defaultValue: {
                id: preFilterFields.stats.defaultValue,
              },
              required: true,
              values:
                preFilterFields.stats.values?.map(({ id, name }) => ({
                  id,
                  value: name,
                })) ?? [],
            }}
          />
        </Stack>
      )}
      {filters.map((filter) => (
        <Stack flexDirection="row" key={filter.id}>
          <DynamicControl control={control} filter={filter} />
        </Stack>
      ))}
      {isInteractiveReport &&
        groupingFields &&
        Object.keys(groupingFields).length > 0 && (
          <Stack width="100%">
            <Box component="h2" sx={{ my: 0 }}>
              <Button
                sx={{
                  color: 'text.secondary',
                }}
                onClick={onToggleGrouping}
                startIcon={
                  <DataOneToThreePipeIcon sx={{ color: 'indigo.500' }} />
                }
                endIcon={
                  <ChevronUpIcon
                    sx={{
                      color: 'text.secondary',
                      transform: isGroupingOpen
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.2s ease-in-out',
                      ml: 1,
                    }}
                  />
                }
                id={`${groupingId}-button`}
                aria-expanded={isGroupingOpen}
                aria-controls={groupingId}
              >
                {t('reports:grouping')}
              </Button>
            </Box>
            <Collapse
              in={isGroupingOpen}
              id={groupingId}
              role="region"
              aria-labelledby={`${groupingId}-button`}
            >
              <Stack
                flexDirection="row"
                gap={2}
                alignItems="flex-start"
                flexWrap="wrap"
                pt={1}
              >
                {groupingFields.groupBy && (
                  <Stack flexDirection="row">
                    <DynamicControl
                      control={control}
                      filter={{
                        id: 'groupBy',
                        inputType: Reporting_TableFilterType.Select,
                        label: t('reports:grouping'),
                        defaultValue: {
                          id: groupingFields.groupBy.defaultValue,
                        },
                        required: false,
                        values:
                          groupingFields.groupBy.values?.map(
                            ({ id, name }) => ({
                              id,
                              value: name,
                            })
                          ) ?? [],
                      }}
                    />
                  </Stack>
                )}

                {groupingFields.timeGroupBy && (
                  <Stack flexDirection="row">
                    <DynamicControl
                      control={control}
                      filter={{
                        id: 'timeGroupBy',
                        inputType: Reporting_TableFilterType.Select,
                        label: t('reports:timeGrouping'),
                        defaultValue: {
                          id: groupingFields.timeGroupBy.defaultValue,
                        },
                        required: false,
                        values:
                          groupingFields.timeGroupBy.values?.map(
                            ({ id, name }) => ({
                              id,
                              value: name,
                            })
                          ) ?? [],
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Collapse>
          </Stack>
        )}

      <Stack
        flexDirection="row"
        alignItems="center"
        sx={({ spacing }) => ({
          height: spacing(6),
        })}
      >
        <LoadingButton
          variant="contained"
          type="submit"
          size="medium"
          loading={isFetching}
          disabled={isFetching}
        >
          {t('common:actions.filter')}
        </LoadingButton>
        {sql && (
          <IconButton onClick={() => setOpenSqlDialog(true)} sx={{ ml: 1 }}>
            <InfoCircleIcon />
          </IconButton>
        )}
      </Stack>
      <Dialog
        open={openSqlDialog}
        onClose={handleCloseDialog}
        scroll="paper"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle onClose={handleCloseDialog}>Sql</DialogTitle>
        <DialogContent>
          <Typography>{sql}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" color="inherit" onClick={handleCloseDialog}>
            {t('common:actions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  ) : null;
};
