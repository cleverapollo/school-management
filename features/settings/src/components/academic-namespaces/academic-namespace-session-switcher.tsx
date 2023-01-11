/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useState } from 'react';
import { Button, MenuItem, Stack, Typography } from '@mui/material';
import { AcademicNamespace, usePermissions } from '@tyro/api';
import MenuPopover from '../../../../../src/components/MenuPopover';
import { HEADERS } from '../../../../../src/constants';
import { useCoreAcademicNamespace } from '../../api/academic-namespaces/academic-namespaces';

interface NamespacesDropdown {
  year: string;
  id: number;
}

export function AcademicNamespaceSessionSwitcher() {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const sessionNamespaceId = Number(
    localStorage.getItem(HEADERS.ACADEMIC_NAMESPACE_ID)
  );
  const { data, isLoading } = useCoreAcademicNamespace();
  const { hasPermission } = usePermissions();
  const [currentYear, setCurrentYear] = useState(sessionNamespaceId || 3);

  const years = data as AcademicNamespace[];
  if (years === null) {
    return null;
  }
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const onClickItem = (value: number) => {
    setCurrentYear(value);
    localStorage.setItem(HEADERS.ACADEMIC_NAMESPACE_ID, value.toString());
    handleClose();
  };

  if (!hasPermission('api:users:read:academic_namespace_switch_session')) {
    return null;
  }
  return (
    <>
      <Button
        onClick={handleOpen}
        aria-label={`Change Academic Namespace. Currently set to ${currentYear}`}
      >
        <Typography
          variant="subtitle1"
          sx={{
            flexGrow: 1,
            color: 'black',
          }}
        >
          {years.find((a) => a.academicNamespaceId === currentYear)?.name || ''}
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
          {years.map((option) => (
            <MenuItem
              key={option.academicNamespaceId}
              selected={option.academicNamespaceId === currentYear}
              onClick={() => onClickItem(option.academicNamespaceId)}
            >
              {option.year}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
