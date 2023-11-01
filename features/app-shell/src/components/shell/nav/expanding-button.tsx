import { IconButton } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '@tyro/icons';
import { NAV } from './config';

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: VoidFunction;
}

export function ExpandButton({ isExpanded, onClick }: ExpandButtonProps) {
  return (
    <IconButton
      sx={{
        position: 'fixed',
        borderRadius: '50%',
        padding: 0,
        border: (theme) => `solid 1px ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.appBar + 1,
        top: 32,
        backdropFilter: 'blur(6px)',
        left: (isExpanded ? NAV.W_DASHBOARD : NAV.W_DASHBOARD_MINI) - 13,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
      }}
      size="small"
      onClick={onClick}
    >
      {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  );
}
