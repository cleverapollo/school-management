import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './hashtag-square.svg';

export const HashtagSquareIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  HashtagSquareIcon.displayName = 'HashtagSquareIcon';
}
