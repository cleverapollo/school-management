import { Box, Card, CardProps, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

type PlaceholderCardProps = PropsWithChildren<{ cardProps?: CardProps }>;

export function PlaceholderCard({ cardProps, children }: PlaceholderCardProps) {
  return (
    <Card {...cardProps} sx={{ p: 3, ...cardProps?.sx }}>
      <Box
        sx={({ palette }) => ({
          backgroundColor: 'slate.50',
          border: `1px dashed ${palette.divider}`,
          borderRadius: 1,
        })}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
          flexWrap="wrap"
          p={4}
        >
          {children}
        </Stack>
      </Box>
    </Card>
  );
}
