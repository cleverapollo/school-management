import { Box, Color, LinearProgress, Stack } from '@mui/material';
import { CheckmarkIcon } from '@tyro/icons';
import { ColorSchema } from '../../../theme/palette';

export interface TableLinearProgressProps {
  value: number | null | undefined;
  total: number | null | undefined;
  ranges?: Array<{
    min: number;
    max: number;
    color: ColorSchema;
    shade?: keyof Color;
    icon?: typeof CheckmarkIcon;
  }>;
}

const defaultRanges: NonNullable<TableLinearProgressProps['ranges']> = [
  {
    min: 0,
    max: 99,
    color: 'slate',
    shade: 300,
  },
  {
    min: 100,
    max: 100,
    color: 'green',
    shade: 400,
    icon: CheckmarkIcon,
  },
];

export function TableLinearProgress({
  value,
  total,
  ranges = defaultRanges,
}: TableLinearProgressProps) {
  const percent = value && total ? Math.min((value / total) * 100, 100) : 0;
  const matchedRange = ranges.find(
    ({ min, max }) => percent >= min && percent <= max
  );
  const {
    color,
    icon: Icon,
    shade = 300,
  } = matchedRange ?? ({ color: 'slate' } as const);

  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      <Box sx={{ width: '4.25rem' }}>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            backgroundColor: `${color}.100`,
            height: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: `${color}.200`,
            borderStyle: 'solid',

            '& .MuiLinearProgress-bar': {
              backgroundColor: `${color}.${shade}`,
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
        {Icon && (
          <Icon
            sx={{
              width: '100%',
              height: '100%',
              color: `${color}.500`,
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
