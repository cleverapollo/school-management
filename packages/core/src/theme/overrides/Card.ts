import { Theme } from '@mui/material/styles';

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          boxShadow: theme.customShadows.card,
          border: `1px solid ${theme.palette.indigo[50]}`,
          borderRadius: Number(theme.shape.borderRadius) * 2,
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            border: `solid 1px ${theme.palette.divider}`,
            boxShadow: 'none',
          },
        },
        {
          props: { variant: 'soft' },
          style: {
            backgroundColor: theme.palette.slate[50],
            padding: theme.spacing(1.5),
            borderRadius: theme.spacing(3.5),
          },
        },
      ],
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: {
          variant: 'body2',
          marginTop: theme.spacing(0.5),
        },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(2.25, 3, 1.25, 3),
          margin: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
