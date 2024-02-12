import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './pin.svg';

export const PinIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  PinIcon.displayName = 'PinIcon';
}
