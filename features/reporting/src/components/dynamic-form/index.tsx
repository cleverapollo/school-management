import { useTranslation } from '@tyro/i18n';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

import { useFormValidator } from '@tyro/core';
import { useMemo } from 'react';
import {
  Reporting_TableFilterInput,
  Reporting_TableFilter,
  Reporting_TableFilterType,
  Reporting_TableFilterValues,
} from '@tyro/api';
import dayjs from 'dayjs';
import { DynamicControl } from './control';

type DynamicFormProps = {
  isFetching: boolean;
  filters: Reporting_TableFilter[];
  onFilterChange: (filters: Reporting_TableFilterInput[]) => void;
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
}: DynamicFormProps) => {
  const { t } = useTranslation(['common']);

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
                  ? [rules.date()]
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
      filters
        .filter((filter) => formData[filter.id])
        .map<Reporting_TableFilterInput>((filter) => ({
          filterId: filter.id,
          filterValue: getValueFormat(formData[filter.id], filter.inputType),
        }))
    );
  });

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
      </Stack>
    </Stack>
  ) : null;
};
