import { alpha, Theme } from '@mui/material/styles';
import { ChipProps } from '@mui/material';
import { Colour } from '@tyro/api';
import { CloseIcon } from './CustomIcons';

const COLORS = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
  'red',
  'indigo',
  ...Object.values(Colour),
  'slate',
  'gray',
] as const;

export default function Chip(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  const rootStyle = (ownerState: ChipProps) => {
    const defaultColor = ownerState.color === 'default';

    const filledVariant = ownerState.variant === 'filled';

    const outlinedVariant = ownerState.variant === 'outlined';

    const softVariant = ownerState.variant === 'soft';

    const defaultStyle = {
      ...(defaultColor && {
        '& .MuiChip-avatar': {
          color: theme.palette.text[isLight ? 'secondary' : 'primary'],
          backgroundColor: alpha(theme.palette.grey[500], 0.48),
        },
        // OUTLINED
        ...(outlinedVariant && {
          border: `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.grey[500], 0.16),
          ...(ownerState.onClick && {
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.32),
            },
          }),
        }),
      }),
    };
    const matchedColor = COLORS.find((color) => color === ownerState.color);

    const colorStyle = matchedColor && {
      '& .MuiChip-avatar': {
        color: theme.palette[matchedColor].lighter,
        backgroundColor: theme.palette[matchedColor].dark,
      },
      // FILLED
      ...(filledVariant && {
        '& .MuiChip-deleteIcon': {
          color: alpha(theme.palette[matchedColor].dark, 0.56),
          '&:hover': {
            color: theme.palette[matchedColor].dark,
          },
        },
      }),
      // SOFT
      ...(softVariant && {
        color: theme.palette[matchedColor][isLight ? 'dark' : 'light'],
        backgroundColor: alpha(theme.palette[matchedColor].main, 0.16),
        ...(ownerState.onClick && {
          '&:hover': {
            backgroundColor: alpha(theme.palette[matchedColor].main, 0.32),
          },
        }),
        '& .MuiChip-deleteIcon': {
          color: alpha(
            theme.palette[matchedColor][isLight ? 'dark' : 'light'],
            0.48
          ),
          ...(ownerState.onClick && {
            '&:hover': {
              color: theme.palette[matchedColor].dark,
            },
          }),
        },
      }),
    };

    return colorStyle ? [colorStyle, defaultStyle] : [defaultStyle];
  };

  return {
    MuiChip: {
      defaultProps: {
        deleteIcon: <CloseIcon />,
      },

      styleOverrides: {
        root: ({ ownerState }: { ownerState: ChipProps }) =>
          rootStyle(ownerState),
      },
    },
  };
}
