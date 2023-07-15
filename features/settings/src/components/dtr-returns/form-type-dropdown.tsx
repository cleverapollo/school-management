import { useTranslation } from '@tyro/i18n';
import { Select } from '@tyro/core';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';

type FormTypeDropdownProps = {
  formTypeId: number;
  onChangeFormType: (formTypeId: number) => void;
};

export const FormTypeDropdown = ({
  formTypeId,
  onChangeFormType,
}: FormTypeDropdownProps) => {
  const { t } = useTranslation(['settings']);

  const { spacing } = useTheme();
  const MAX_WIDTH = spacing(34);

  const allFormTypes = [
    {
      id: 1,
      name: 'A File',
    },
    {
      id: 2,
      name: 'B File',
    },
    {
      id: 3,
      name: 'C File',
    },
    {
      id: 4,
      name: 'D File',
    },
    {
      id: 5,
      name: 'E File',
    },
  ];

  const options = useMemo(
    () =>
      allFormTypes?.map((formType) => ({
        id: formType.id,
        name: formType?.name ?? '',
      })) || [],
    [allFormTypes]
  );

  return (
    <Select
      label={t('settings:dtrReturns.form')}
      value={formTypeId}
      variant="white-filled"
      optionIdKey="id"
      options={options}
      getOptionLabel={(option) => option.name}
      sx={{ maxWidth: MAX_WIDTH }}
      onChange={(ev) => {
        onChangeFormType(Number(ev.target.value));
      }}
    />
  );
};
