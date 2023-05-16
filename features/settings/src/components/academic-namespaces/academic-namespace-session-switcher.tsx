import {
  usePermissions,
  useAcademicNamespace,
  EmulateHeaders,
  queryClient,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';

export function AcademicNamespaceSessionSwitcher() {
  const { t } = useTranslation(['settings']);
  const { allNamespaces, activeAcademicNamespace } = useAcademicNamespace();
  const { hasPermission } = usePermissions();
  const { spacing } = useTheme();

  const onSelect = (namespace: NonNullable<typeof allNamespaces>[number]) => {
    if (!namespace) return;

    localStorage.setItem(
      EmulateHeaders.ACADEMIC_NAMESPACE_ID,
      namespace.academicNamespaceId.toString()
    );
    queryClient.invalidateQueries();
  };

  const menuItems = useMemo(
    () =>
      allNamespaces?.map((option) => ({
        label: String(option?.year),
        onClick: () => onSelect(option),
      })) ?? [],
    [allNamespaces]
  );

  if (
    (allNamespaces ?? []).length === 0 ||
    !hasPermission('api:users:read:academic_namespace_switch_session')
  ) {
    return null;
  }

  return (
    <ActionMenu
      buttonLabel={activeAcademicNamespace?.name || ''}
      buttonProps={{
        size: 'small',
      }}
      menuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        sx: {
          '& .MuiMenu-list': {
            minWidth: spacing(15),
            maxHeight: spacing(40),
          },
        },
      }}
      aria-label={t('settings:changeAcademicNamespaceCurrentlySet', {
        name: activeAcademicNamespace?.name,
      })}
      menuItems={menuItems}
    />
  );
}
