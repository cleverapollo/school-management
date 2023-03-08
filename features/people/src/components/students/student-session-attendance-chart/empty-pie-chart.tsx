import { Box } from '@mui/material';

export function EmptyPieChart() {
  return (
    <Box
      sx={{
        borderColor: 'divider',
        borderStyle: 'solid',
        borderWidth: 10,
        width: 156,
        height: 156,
        borderRadius: '50%',
      }}
    />
  );
}
