import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './warning-circle-with-pencil.svg';

export const WarningCircleWithPencilIcon = forwardRef<
  SVGSVGElement,
  SvgIconProps
>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  WarningCircleWithPencilIcon.displayName = 'WarningCircleWithPencilIcon';
}
