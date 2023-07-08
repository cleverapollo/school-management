import { Chip, ChipProps } from '@mui/material';
import { forwardRef } from 'react';

interface IconChipProps extends ChipProps {
  'aria-label': string;
  icon: ChipProps['icon'];
  onClick: ChipProps['onClick'];
}

const chipWidths = {
  small: 24,
  medium: 32,
};

export const IconChip = forwardRef<HTMLDivElement, IconChipProps>(
  ({ 'aria-label': ariaLabel, sx, ...props }, ref) => (
    <Chip
      ref={ref}
      label=""
      variant="soft"
      color="primary"
      aria-label={ariaLabel}
      sx={{
        width: chipWidths[props.size || 'medium'],
        '& .MuiChip-icon': {
          m: 0,
        },
        '& .MuiChip-label': {
          display: 'none',
        },
        ...sx,
      }}
      {...props}
    />
  )
);

if (process.env.NODE_ENV !== 'production') {
  IconChip.displayName = 'IconChip';
}
