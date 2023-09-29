import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

export const OccurrenceTypesContainer = () => {
  const test = 'test';
  return (
    <Box
      height="80px"
      marginBottom={6}
      sx={{ backgroundColor: 'white', borderRadius: 2 }}
    >
      <Stack paddingX={3} paddingY={2}>
        <Typography variant="h6">Occurrence Types</Typography>
      </Stack>
    </Box>
  );
};
