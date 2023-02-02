import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './close.svg';

export const CloseIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  CloseIcon.displayName = 'CloseIcon';
}
