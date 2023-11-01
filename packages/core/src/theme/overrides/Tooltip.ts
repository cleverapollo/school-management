import { Theme } from '@mui/material/styles';

export default function Tooltip(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.blue[isLight ? 900 : 800],
        },
        arrow: {
          color: theme.palette.blue[isLight ? 900 : 800],
        },
      },
    },
  };
}
