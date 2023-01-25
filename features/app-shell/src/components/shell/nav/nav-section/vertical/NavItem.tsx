/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Tooltip, Link, ListItemText } from '@mui/material';
//
import { Iconify } from '../../../../../../../../src/components/iconify';
//
import { NavItemProps } from '../types';
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';

// ----------------------------------------------------------------------

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  ...other
}: NavItemProps) {
  const { title, path, icon, children } = item;

  const subItem = !icon;

  const renderContent = (
    <StyledItem depth={depth} active={active} {...other}>
      {icon && <StyledIcon>{icon}</StyledIcon>}

      {subItem && (
        <StyledIcon>
          <StyledDotIcon active={active && subItem} />
        </StyledIcon>
      )}

      <ListItemText
        primary={title}
        // secondary={
        //   caption && (
        //     <Tooltip title={translate(caption)} placement="top-start">
        //       <span>{translate(caption)}</span>
        //     </Tooltip>
        //   )
        // }
        primaryTypographyProps={{
          noWrap: true,
          component: 'span',
          variant: active ? 'subtitle2' : 'body2',
        }}
        secondaryTypographyProps={{
          noWrap: true,
          variant: 'caption',
        }}
      />

      {/* Look at adding this feature back in as it's needed for mail */}
      {/* {info && (
        <Box component="span" sx={{ lineHeight: 0 }}>
          {info}
        </Box>
      )} */}

      {!!children && (
        <Iconify
          width={16}
          icon={
            open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'
          }
          sx={{ ml: 1, flexShrink: 0 }}
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

    // Has child
    if (children) {
      return renderContent;
    }

    // Default
    return (
      <Link component={RouterLink} to={path ?? ''} underline="none">
        {renderContent}
      </Link>
    );
  };

  return renderItem();
}
