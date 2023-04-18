import { useAcademicNamespace } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { Select } from '@tyro/core';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';

type AcademicYearDropdownProps = {
  academicNamespaceId: number;
  onChangeAcademicNamespace: (academicNamespaceId: number) => void;
};

export const AcademicYearDropdown = ({
  academicNamespaceId,
  onChangeAcademicNamespace,
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
      getOptionLabel={(option) => option.name}
      sx={{ maxWidth: MAX_WIDTH }}
      onChange={(ev) => {
        onChangeAcademicNamespace(Number(ev.target.value));
      }}
    />
  );
};
