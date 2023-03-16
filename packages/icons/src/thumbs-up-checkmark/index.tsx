import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './thumbs-up-checkmark.svg';

export const ThumbsUpCheckmarkIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  ThumbsUpCheckmarkIcon.displayName = 'ThumbsUpCheckmarkIcon';
}
