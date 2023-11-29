import { forwardRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent } from './wallet-with-money.svg';

export const WalletWithMoneyIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} component={ReactComponent} inheritViewBox {...props} />
  )
);

if (process.env.NODE_ENV !== 'production') {
  WalletWithMoneyIcon.displayName = 'WalletWithMoneyIcon';
}
