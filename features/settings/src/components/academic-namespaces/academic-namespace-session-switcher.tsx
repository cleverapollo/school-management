/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useState } from 'react';
import { Button, MenuItem, Stack, Typography } from '@mui/material';
import {
  usePermissions,
  useAcademicNamespace,
  EmulateHeaders,
} from '@tyro/api';
import MenuPopover from '../../../../../src/components/MenuPopover';

export function AcademicNamespaceSessionSwitcher() {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const { allNamespaces, activeAcademicNamespace, isLoading } =
    useAcademicNamespace();
  const { hasPermission } = usePermissions();
  const [currentYear, setCurrentYear] = useState(activeAcademicNamespace);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const onSelect = (namespace: NonNullable<typeof allNamespaces>[number]) => {
    if (!namespace) return;

    setCurrentYear(namespace);
    localStorage.setItem(
      EmulateHeaders.ACADEMIC_NAMESPACE_ID,
      namespace.academicNamespaceId.toString()
    );
    handleClose();
  };

  useEffect(() => {
    if (activeAcademicNamespace) {
      setCurrentYear(activeAcademicNamespace);
    }
  }, [activeAcademicNamespace]);

  if (
    isLoading ||
    !hasPermission('api:users:read:academic_namespace_switch_session')
  ) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        aria-label={`Change Academic Namespace. Currently set to ${
          currentYear?.name ?? ''
        }`}
      >
        <Typography
          variant="subtitle1"
          sx={{
            flexGrow: 1,
            color: 'black',
          }}
        >
          {activeAcademicNamespace?.name || ''}
        </Typography>
      </Button>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Stack spacing={0.75}>
          {allNamespaces?.map((option) => (
            <MenuItem
              key={option?.academicNamespaceId}
              selected={
                option?.academicNamespaceId === currentYear?.academicNamespaceId
              }
              onClick={() => onSelect(option)}
            >
              {option?.year}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
