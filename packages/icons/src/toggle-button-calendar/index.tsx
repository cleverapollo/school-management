import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './toggle-button-calendar.svg';

export const ToggleButtonCalendarIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  ToggleButtonCalendarIcon.displayName = 'ToggleButtonCalendarIcon';
}
