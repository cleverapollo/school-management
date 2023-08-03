import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './checkmark-circle-with-pencil.svg';

export const CheckmarkCircleWithPencilIcon = forwardRef<
  SVGSVGElement,
  SvgIconProps
>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  CheckmarkCircleWithPencilIcon.displayName = 'CheckmarkCircleWithPencilIcon';
}
