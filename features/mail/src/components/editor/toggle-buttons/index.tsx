import {
  ToggleButtonProps as MuiToggleButtonProps,
  ToggleButton as MuiToggleButton,
  Tooltip,
  TooltipProps,
} from '@mui/material';
import { forwardRef } from 'react';

interface ToggleButtonProps extends MuiToggleButtonProps {
  title: string;
  placement?: TooltipProps['placement'];
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ title, placement = 'bottom', ...props }, ref) => (
    <Tooltip title={title} placement={placement} enterDelay={500}>
      <MuiToggleButton
        ref={ref}
        aria-label={title}
        sx={{
          padding: 0.5,
          color: 'text.primary',
          '& svg': {
            fontSize: '1.25rem',
          },
        }}
        {...props}
      />
    </Tooltip>
  )
);

if (process.env.NODE_ENV !== 'production') {
  ToggleButton.displayName = 'ToggleButton';
}
