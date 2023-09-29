import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';

export const BehaviourContainer = () => {
  const test = 'test';
  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardHeader
          component="h3"
          title="Behaviour - Year 2022/23"
          sx={{
            p: 0,
            border: 0,
            textAlign: 'center',
            fontWeight: 600,
            '& .MuiTypography-root': {
              fontWeight: 600,
            },
          }}
        />
      </Stack>
      <CardContent>
        <Stack>
          <Box>Occurrence Types</Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
