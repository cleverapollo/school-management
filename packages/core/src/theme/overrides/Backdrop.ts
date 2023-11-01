import { alpha, Theme } from '@mui/material/styles';

export default function Backdrop({ isLight, palette }: Theme) {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(
            isLight ? palette.slate[900] : palette.slate[50],
            0.1
          ),
          backdropFilter: 'blur(8px)',
        },
        invisible: {
          background: 'transparent',
          backdropFilter: 'none',
        },
      },
    },
  };
}
