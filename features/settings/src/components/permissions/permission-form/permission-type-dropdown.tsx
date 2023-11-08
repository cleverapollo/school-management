import { useTranslation } from '@tyro/i18n';
import { PermissionType } from '@tyro/api';
import { Control, Path } from 'react-hook-form';
import { RHFSelect } from '@tyro/core';
import { PermissionFormState } from './types';

const permissionTypeOptions = Object.values(PermissionType);

type PermissionTypeDropdownProps = {
  name: Path<PermissionFormState>;
  control: Control<PermissionFormState>;
};

export const PermissionTypeDropdown = ({
  name,
  control,
}: PermissionTypeDropdownProps) => {
  const { t } = useTranslation(['settings']);

  return (
    <RHFSelect
      fullWidth
      canDeleteValue
      sx={{ maxWidth: 300 }}
      label={t('settings:permissions.permissionType')}
      options={permissionTypeOptions}
      size="small"
      variant="white-filled"
      getOptionLabel={(option) =>
        t(`settings:permissions.permissionTypeOption.${option}`)
      }
      controlProps={{
        name,
        control,
      }}
    />
  );
};
