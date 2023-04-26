import { Box, LinearProgress, Stack, useTheme } from '@mui/material';
import { CheckmarkIcon } from '@tyro/icons';

interface TableLinearProgressProps {
  value: number | null | undefined;
  total: number | null | undefined;
}

export function TableLinearProgress({
  value,
  total,
}: TableLinearProgressProps) {
  const percent = value && total ? Math.min((value / total) * 100, 100) : 0;
  const isComplete = percent >= 100;
  const color = isComplete ? 'green' : 'slate';
  const barShade = color === 'slate' ? 300 : 400;
  const { palette } = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      <Box sx={{ width: '4.25rem' }}>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            backgroundColor: palette[color][100],
            height: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: palette[color][200],
            borderStyle: 'solid',

            '& .MuiLinearProgress-bar': {
              backgroundColor: palette[color][barShade],
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: 16,
          height: 16,
        }}
      >
        {isComplete && (
          <CheckmarkIcon
            sx={{
              width: '100%',
              height: '100%',
              color: 'green.500',
              '& path': {
                strokeWidth: 3,
              },
            }}
          />
        )}
      </Box>
      <span>
        {value ?? '-'}/{total ?? '-'}
      </span>
    </Stack>
  );
}
