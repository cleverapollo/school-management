import { useTranslation } from '@tyro/i18n';
import { PermissionType } from '@tyro/api';
import { Control, Path, useWatch } from 'react-hook-form';
import { RHFSelect } from '@tyro/core';
import { CloseIcon } from '@tyro/icons';
import { IconButton } from '@mui/material';
import { PermissionFormState } from './types';

const permissionTypeOptions = Object.values(PermissionType);

type PermissionTypeDropdownProps = {
  name: Path<PermissionFormState>;
  control: Control<PermissionFormState>;
  onRemovePermissionType: () => void;
};

export const PermissionTypeDropdown = ({
  name,
  control,
  onRemovePermissionType,
}: PermissionTypeDropdownProps) => {
  const { t } = useTranslation(['settings']);

  const currentPermissionType = useWatch({
    control,
    name,
  });

  return (
    <RHFSelect
      fullWidth
      sx={{ maxWidth: 300 }}
      label={t('settings:permissions.permissionType')}
      options={permissionTypeOptions}
      size="small"
      variant="white-filled"
      getOptionLabel={(option) =>
        t(`settings:permissions.permissionTypeOption.${option}`)
      }
      InputProps={{
        endAdornment: currentPermissionType && (
          <IconButton
            size="small"
            sx={{ mr: 2.5 }}
            type="button"
            onClick={onRemovePermissionType}
          >
            <CloseIcon />
          </IconButton>
        ),
      }}
      controlProps={{
        name,
        control,
      }}
    />
  );
};
