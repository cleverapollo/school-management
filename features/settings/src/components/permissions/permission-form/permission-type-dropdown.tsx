import { useTranslation } from '@tyro/i18n';
import { PermissionType } from '@tyro/api';
import { Control, FieldValues, Path } from 'react-hook-form';
import { RHFSelect } from '@tyro/core';

const permissionTypeOptions = Object.values(PermissionType);

type PermissionTypeDropdownProps<TField extends FieldValues> = {
  name: Path<TField>;
  control: Control<TField>;
};

export const PermissionTypeDropdown = <TField extends FieldValues>({
  name,
  control,
}: PermissionTypeDropdownProps<TField>) => {
  const { t } = useTranslation(['settings']);

  return (
    <RHFSelect
      fullWidth
      label={t('settings:permissions.permissionType')}
      options={permissionTypeOptions}
      size="small"
      variant="white-filled"
      getOptionLabel={(option) =>
        t(`settings:permissions.permissionTypeOption.${option}`)
      }
      controlProps={{ name, control }}
    />
  );
};
