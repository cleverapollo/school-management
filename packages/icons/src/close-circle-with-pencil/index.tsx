import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './close-circle-with-pencil.svg';

export const CloseCircleWithPencilIcon = forwardRef<
  SVGSVGElement,
  SvgIconProps
>((props, ref) => (
  <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
));

if (process.env.NODE_ENV !== 'production') {
  CloseCircleWithPencilIcon.displayName = 'CloseCircleWithPencilIcon';
}
