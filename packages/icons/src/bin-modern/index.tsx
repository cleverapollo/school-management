import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './bin-modern.svg';

export const BinIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  BinIcon.displayName = 'BinIcon';
}
