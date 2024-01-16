import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './calendar-cut-dotted-lines.svg';

export const CalendarCutDottedLinesIcon = forwardRef<
  SVGSVGElement,
  SvgIconProps
>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  CalendarCutDottedLinesIcon.displayName = 'CalendarCutDottedLinesIcon';
}
