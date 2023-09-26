import { Link as RouterLink } from 'react-router-dom';
import { Box, Tooltip, Link, ListItemText } from '@mui/material';
import { ChevronDownIcon, ChevronRightIcon } from '@tyro/icons';
import { NavItemProps } from '../types';
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  ...other
}: NavItemProps) {
  const { title, path, info, icon, children } = item;

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

      {info && <Box>{info}</Box>}

      {!!children &&
        (open ? (
          <ChevronDownIcon sx={{ ml: 1, flexShrink: 0 }} />
        ) : (
          <ChevronRightIcon sx={{ ml: 1, flexShrink: 0 }} />
        ))}
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
