import { Box, Tooltip } from '@mui/material';
import { Colour } from '@tyro/api/src';
import { CoverEvent } from '../../../hooks/use-cover-table';
import { SubIcon } from '../../common/sub-icon';

interface SubIconWithTypeProps {
  substitutionType: NonNullable<CoverEvent['substitution']>['substitutionType'];
}

export const colorsBySubstitutionType = {
  'S&S': 'green',
  'Casual (Paid)': 'red',
  'Personal (Unpaid)': 'yellow',
  'Windfall (Unpaid i.e. class away)': 'blue',
  'Emergency 35 hours': 'orange',
} as const;

export function SubIconWithType({ substitutionType }: SubIconWithTypeProps) {
  const code = substitutionType.code as keyof typeof colorsBySubstitutionType;
  const color = (colorsBySubstitutionType[code] || 'slate') as Colour;

  return (
    <Tooltip title={substitutionType.name}>
      <Box>
        <SubIcon color={color} size="large" />
      </Box>
    </Tooltip>
  );
}
