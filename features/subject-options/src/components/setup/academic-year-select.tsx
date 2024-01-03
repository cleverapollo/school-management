import { RHFSelect, SelectProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useAcademicNamespace } from '@tyro/api';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { useEffect, useMemo } from 'react';

export type AcademicYearSelectProps<TField extends FieldValues> = {
  controlProps: UseControllerProps<TField>;
  label?: string;
  sx?: SelectProps<{ id: number; name: string }>['sx'];
};

export const AcademicYearSelect = <TField extends FieldValues>({
  controlProps,
  ...selectProps
}: AcademicYearSelectProps<TField>) => {
  const { t } = useTranslation(['common']);
  const {
    field: { value, onChange },
  } = useController(controlProps);

  const { allNamespaces, activeAcademicNamespace } = useAcademicNamespace();

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

  useEffect(() => {
    if (!value && activeAcademicNamespace) {
      onChange(activeAcademicNamespace.academicNamespaceId);
    }
  }, [value, onChange, activeAcademicNamespace]);

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
