import { Theme } from '@mui/material/styles';

export default function ControlLabel(theme: Theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.disabled,
          '&:not(.MuiInputLabel-root)': {
            color: theme.palette.text.secondary,
            fontWeight: theme.typography.fontWeightMedium,
            '&.Mui-focused': {
              color: theme.palette.text.secondary,
            },
          },
        },
      },
    },
  };
}
