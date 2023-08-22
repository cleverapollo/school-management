import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './room-swap.svg';

export const RoomSwapIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  RoomSwapIcon.displayName = 'RoomSwapIcon';
}
