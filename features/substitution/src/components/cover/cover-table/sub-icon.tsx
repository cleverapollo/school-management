import { Box, Tooltip } from '@mui/material';
import { SwapHorizontalIcon } from '@tyro/icons';
import { CoverEvent } from '../../../hooks/use-cover-table';

interface SubIconProps {
  substitutionType: NonNullable<CoverEvent['substitution']>['substitutionType'];
}

const colorsBySubstitutionType = {
  'S&S': 'green',
  'Casual (Paid)': 'red',
  'Personal (Unpaid)': 'yellow',
  'Windfall (Unpaid i.e. class away)': 'blue',
  'Covid-19 related': 'purple',
  'Emergency 35 hours': 'orange',
} as const;

export function SubIcon({ substitutionType }: SubIconProps) {
  const code = substitutionType.code as keyof typeof colorsBySubstitutionType;
  const color = colorsBySubstitutionType[code] || 'slate';

  return (
    <Tooltip title={substitutionType.name}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundColor: `${color}.main`,
          borderRadius: '50%',
          width: 18,
          height: 18,

          '& svg': {
            width: 16,
            height: 16,
            transform: 'rotate(-45deg)',
            '& path': {
              strokeWidth: 2,
            },
          },
        }}
      >
        <SwapHorizontalIcon />
      </Box>
    </Tooltip>
  );
}
