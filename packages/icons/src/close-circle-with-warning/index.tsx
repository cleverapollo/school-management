import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './close-circle-with-warning.svg';

export const CloseCircleWithWarningIcon = forwardRef<
  SVGSVGElement,
  SvgIconProps
>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  CloseCircleWithWarningIcon.displayName = 'CloseCircleWithWarningIcon';
}
