import {
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from '@mui/material';
import { forwardRef } from 'react';

interface IconButtonWithTooltipProps extends IconButtonProps {
  title: string;
  placement?: TooltipProps['placement'];
}

export const IconButtonWithTooltip = forwardRef<
  HTMLButtonElement,
  IconButtonWithTooltipProps
>(({ title, placement = 'bottom', ...props }, ref) => (
  <Tooltip title={title} placement={placement} enterDelay={500}>
    <IconButton ref={ref} size="small" {...props} />
  </Tooltip>
));

if (process.env.NODE_ENV !== 'production') {
  IconButtonWithTooltip.displayName = 'IconButtonWithTooltip';
}
