import { alpha, Theme } from '@mui/material/styles';

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': {
              color: theme.palette.text.disabled,
            },
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: alpha(theme.palette.slate[400], 0.56),
          },
          '&:after': {
            borderBottomColor: theme.palette.slate.main,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.slate[400], 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.slate[400], 0.16),
          },
          '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.slate[400], 0.16),
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
          '& .MuiInputAdornment-root.MuiInputAdornment-positionStart.MuiInputAdornment-filled':
            {
              marginTop: '0 !important',
            },
        },
        underline: {
          '&:before, :after': {
            display: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.slate[400], 0.32),
          },
          '&.Mui-focused, &:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1,
              borderColor: theme.palette.slate.main,
            },
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
        },
      },
    },
  };
}
