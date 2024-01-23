import { Box, Stack, Typography } from '@mui/material';
import { Colour } from '@tyro/api';

interface ColorCardProps {
  isMobile?: boolean;
  color?: Colour | null;
  text?: string | JSX.Element;
}

export function ColorCard({ color, text, isMobile = false }: ColorCardProps) {
  const colorWithDefault = color ?? 'slate';

  return (
    <Stack
      direction="row"
      sx={{
        backgroundColor: `${colorWithDefault}.100`,
        borderRadius: 0.75,
        alignItems: 'stretch',
        height: 'auto',
        p: 0.75,
        pr: 1.25,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 3,
          borderRadius: 1.5,
          backgroundColor: `${colorWithDefault}.main`,
          mr: 0.75,
        }}
      />
      <Typography
        component="span"
        variant="subtitle2"
        sx={{ flex: 1, fontSize: isMobile ? '0.75rem' : undefined }}
      >
        {text ?? '-'}
      </Typography>
    </Stack>
  );
}
