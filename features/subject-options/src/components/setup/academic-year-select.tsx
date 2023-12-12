import { RHFSelect } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useAcademicNamespace } from '@tyro/api';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { useMemo } from 'react';

export type AcademicYearSelectProps<TField extends FieldValues> = {
  controlProps: UseControllerProps<TField>;
  label?: string;
};

export const AcademicYearSelect = <TField extends FieldValues>({
  controlProps,
  ...selectProps
}: AcademicYearSelectProps<TField>) => {
  const { t } = useTranslation(['common']);

  const { allNamespaces } = useAcademicNamespace();

  const options = useMemo(
    () =>
      allNamespaces
        ?.sort((prev, next) => (prev && next && next.year - prev.year) ?? 0)
        ?.map((namespace) => ({
          id: namespace?.academicNamespaceId,
          name: namespace?.name ?? '',
        })) || [],
    [allNamespaces]
  );

  return (
    <RHFSelect
      label={t('common:academicYear')}
      controlProps={controlProps}
      {...selectProps}
      options={options}
      optionIdKey="id"
      getOptionLabel={(option) => option.name}
      fullWidth
    />
  );
};
