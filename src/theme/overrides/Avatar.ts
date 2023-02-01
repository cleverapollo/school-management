import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Avatar(theme: Theme) {
  return {
    MuiAvatarGroup: {
      defaultProps: {
        max: 4,
      },
      styleOverrides: {
        root: {
          justifyContent: 'flex-end',
        },
        avatar: {
          fontSize: 16,
          fontWeight: theme.typography.fontWeightMedium,
          '&:first-of-type': {
            fontSize: 12,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.lighter,
          },
        },
      },
    },
  };
}
