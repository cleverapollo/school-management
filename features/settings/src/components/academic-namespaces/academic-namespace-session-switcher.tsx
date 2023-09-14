import { useAcademicNamespace } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ActionMenu } from '@tyro/core';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { changeAcademicNamespace } from '../../utils/change-academic-namespace';

export function AcademicNamespaceSessionSwitcher() {
  const { t } = useTranslation(['settings']);
  const { allNamespaces, activeAcademicNamespace } = useAcademicNamespace();
  const { spacing } = useTheme();

  const onSelect = (namespace: NonNullable<typeof allNamespaces>[number]) => {
    if (!namespace) return;

    changeAcademicNamespace(namespace);
  };

  const menuItems = useMemo(
    () =>
      allNamespaces
        ?.sort((a, b) => b.year - a.year)
        ?.map((option) => ({
          label: String(option?.year),
          onClick: () => onSelect(option),
        })) ?? [],
    [allNamespaces]
  );

  if ((allNamespaces ?? []).length === 0) {
    return null;
  }

  return (
    <ActionMenu
      buttonLabel={activeAcademicNamespace?.name || ''}
      buttonProps={{
        size: 'small',
      }}
      menuProps={{
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
