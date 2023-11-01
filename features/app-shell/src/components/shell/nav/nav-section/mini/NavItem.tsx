import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Tooltip, Link, ListItemText } from '@mui/material';

import { ChevronRightIcon } from '@tyro/icons';
import { NavItemProps } from '../types';
import { StyledItem, StyledIcon } from './styles';

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  ({ item, depth, open, active, isExternalLink, ...other }, ref) => {
    const { title, path, icon, children } = item;

    const subItem = depth !== 1;

    const renderContent = (
      <StyledItem
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        // disabled={disabled}
        {...other}
      >
        {icon && <StyledIcon>{icon}</StyledIcon>}

        <ListItemText
          primary={title}
          primaryTypographyProps={{
            noWrap: true,
            sx: {
              width: 72,
              fontSize: 10,
              lineHeight: '16px',
              textAlign: 'center',
              ...(active && {
                fontWeight: 'fontWeightMedium',
              }),
              ...(subItem && {
                fontSize: 14,
                width: 'auto',
                textAlign: 'left',
              }),
            },
          }}
        />

        {/* {caption && (
          <Tooltip title={translate(caption)} arrow placement="right">
            <Iconify
              icon="eva:info-outline"
              width={16}
              sx={{
                top: 11,
                left: 6,
                position: 'absolute',
              }}
            />
          </Tooltip>
        )} */}

        {!!children && (
          <ChevronRightIcon
            sx={{
              width: 20,
              height: 20,
              top: 9,
              right: 3,
              position: 'absolute',
            }}
          />
        )}
      </StyledItem>
    );

    const renderItem = () => {
      // ExternalLink
      if (isExternalLink)
        return (
          <Link href={path} target="_blank" rel="noopener" underline="none">
            {renderContent}
          </Link>
        );

      if (children) return renderContent;

      // Default
      return (
        <Link component={RouterLink} to={path ?? ''} underline="none">
          {renderContent}
        </Link>
      );
    };

    return renderItem();
  }
);

if (process.env.NODE_ENV === 'development') {
  NavItem.displayName = 'NavItem';
}

export default NavItem;
