import { useTranslation } from '@tyro/i18n';
import {
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

import { Dialog, DialogTitle, useFormValidator } from '@tyro/core';
import { useMemo, useState } from 'react';
import {
  Reporting_TableFilter,
  Reporting_TableFilterType,
  Reporting_TableFilterValues,
} from '@tyro/api';
import dayjs, { Dayjs } from 'dayjs';
import { InfoCircleIcon } from '@tyro/icons';
import { DynamicControl } from './control';

type DynamicFormProps = {
  isFetching: boolean;
  filters: Reporting_TableFilter[];
  onFilterChange: (filters: Reporting_TableFilter[]) => void;
  sql: string;
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
  onFilterChange,
  sql,
}: DynamicFormProps) => {
  const { t } = useTranslation(['common']);
  const [openSqlDialog, setOpenSqlDialog] = useState(false);

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

  const onSubmit = handleSubmit((formData) => {
    onFilterChange(
      filters.map<Reporting_TableFilter>((filter) => ({
        ...filter,
        defaultValue: getValueFormat(formData[filter.id], filter.inputType),
      }))
    );
  });

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
      {filters.map((filter) => (
        <Stack flexDirection="row" key={filter.id}>
          <DynamicControl control={control} filter={filter} />
        </Stack>
      ))}
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
        <IconButton onClick={() => setOpenSqlDialog(true)} sx={{ ml: 1 }}>
          <InfoCircleIcon />
        </IconButton>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDialog}
          >
            {t('common:actions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  ) : null;
};
