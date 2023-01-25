import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './ga-flag.svg';

export const FlagGaIcon = forwardRef<SVGSVGElement, SvgIconProps>(
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
  FlagGaIcon.displayName = 'FlagGaIcon';
}
