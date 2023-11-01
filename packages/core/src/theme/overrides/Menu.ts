import { Theme } from '@mui/material/styles';

export default function Menu(theme: Theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          margin: theme.spacing(0, 1),
          padding: theme.spacing(0.75, 1.25),
          borderRadius: 4,
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: theme.palette.action.hover,
          },
          '& .MuiTouchRipple-child': {
            backgroundColor: theme.palette.indigo[500],
          },
        },
      },
    },
  };
}
