import { Theme } from '@mui/material/styles';
import { InputSelectIcon } from './CustomIcons';

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: InputSelectIcon,
      },
      styleOverrides: {
        icon: {
          width: '1.2rem',
          height: '1.2rem',
          top: `calc(50 % - 0.6em)`,
          right: 12,
          color: theme.palette.primary.main,
        },
      },
    },
  };
}
