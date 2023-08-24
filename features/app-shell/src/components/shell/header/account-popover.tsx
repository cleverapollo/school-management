/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useState } from 'react';
import { useNavigate, redirect } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { useAuth, useUser, usePermissions } from '@tyro/api';
import { Avatar, Link } from '@tyro/core';
import MenuPopover from '../../../../../../src/components/menu-popover';
import { IconButtonAnimate } from '../../../../../../src/components/animate';
// ----------------------------------------------------------------------
const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/profile',
  },
  {
    label: 'Settings',
    linkTo: '/settings',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { logout } = useAuth();

  const { isStaffUserWithPermission } = usePermissions();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const profileId = activeProfile?.partyId;
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleClickItem = (path: string) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          src={activeProfile?.avatarUrl}
          name={activeProfile?.nickName ?? undefined}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 200, p: 0 }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          {profileId &&
            isStaffUserWithPermission('ps:1:people:view_staff_profile') && (
              <Link
                to={`/people/staff/${profileId}/personal`}
                onClick={handleClosePopover}
              >
                <Typography variant="subtitle2" noWrap>
                  {activeProfile?.nickName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                  noWrap
                >
                  {activeProfile?.tenant.name}
                </Typography>
              </Link>
            )}
        </Box>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
