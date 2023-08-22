import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './tiny-pencil.svg';

export const TinyPencilIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  TinyPencilIcon.displayName = 'TinyPencilIcon';
}
