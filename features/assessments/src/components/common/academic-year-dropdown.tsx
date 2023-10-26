import {
  ReturnTypeFromUseAcademicNamespace,
  useAcademicNamespace,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { Select, SelectProps } from '@tyro/core';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';

type AcademicYearDropdownProps = {
  academicNamespaceId: number;
  onChangeAcademicNamespace: (academicNamespaceId: number) => void;
  sx?: SelectProps<
    NonNullable<ReturnTypeFromUseAcademicNamespace['allNamespaces']>[number]
  >['sx'];
};

export const AcademicYearDropdown = ({
  academicNamespaceId,
  onChangeAcademicNamespace,
  sx,
}: AcademicYearDropdownProps) => {
  const { t } = useTranslation(['assessments']);

  const { spacing } = useTheme();
  const MAX_WIDTH = spacing(34);

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
    <Select
      label={t('assessments:academicYear')}
      value={academicNamespaceId}
      variant="white-filled"
      optionIdKey="id"
      options={options}
      fullWidth
      getOptionLabel={(option) => option.name}
      sx={{ maxWidth: MAX_WIDTH, ...sx }}
      onChange={(ev) => {
        onChangeAcademicNamespace(Number(ev.target.value));
      }}
    />
  );
};
