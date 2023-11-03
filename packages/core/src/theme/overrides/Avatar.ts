import { Theme } from '@mui/material/styles';

export default function Avatar(theme: Theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightBold,
        },
      },
    },
    MuiAvatarGroup: {
      defaultProps: {
        max: 4,
      },
      styleOverrides: {
        root: {
          justifyContent: 'flex-end',
        },
        avatar: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightBold,
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
