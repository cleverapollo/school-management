import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './en-flag.svg';

export const FlagEnIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon
      ref={ref}
      component={ReactComponent}
      inheritViewBox
      sx={{
        height: '0.75em',
      }}
      {...props}
    />
  )
);

if (process.env.NODE_ENV !== 'production') {
  FlagEnIcon.displayName = 'FlagEnIcon';
}
