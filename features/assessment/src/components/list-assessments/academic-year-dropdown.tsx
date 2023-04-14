import { MenuItem, TextField } from '@mui/material';
import { useCoreAcademicNamespace } from '@tyro/api';
import { useEffect, useState } from 'react';
import { useTranslation } from '@tyro/i18n';

type AcademicYearDropdownProps = {
  academicNamespaceId: number;
  onChangeAcademicNamespace: (academicNamespaceId: number) => void;
};

export const AcademicYearDropdown = ({
  academicNamespaceId,
  onChangeAcademicNamespace,
}: AcademicYearDropdownProps) => {
  const { t } = useTranslation(['assessment']);

  const { data: academicNamespacesData } = useCoreAcademicNamespace();
  const [academicYear, setAcademicYear] = useState<number>(academicNamespaceId);

  academicNamespacesData?.sort(
    (prev, next) => (prev && next && next.year - prev.year) ?? 0
  );

  useEffect(() => {
    setAcademicYear(academicNamespaceId);
  }, [academicNamespaceId]);

  return (
    <TextField
      select
      label={t('assessment:academicYear')}
      value={academicYear}
      sx={{
        maxWidth: '239px',
      }}
      SelectProps={{
        MenuProps: {
          sx: {
            maxHeight: '350px',
          },
        },
      }}
      onChange={(ev) => {
        const newAcademicYear = +ev.target.value;

        setAcademicYear(newAcademicYear);
        onChangeAcademicNamespace(newAcademicYear);
      }}
    >
      {academicNamespacesData?.map((namespace) => (
        <MenuItem
          key={namespace?.academicNamespaceId}
          value={namespace?.academicNamespaceId}
        >
          {namespace?.name}
        </MenuItem>
      ))}
    </TextField>
  );
};
