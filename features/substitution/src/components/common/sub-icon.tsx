import { Box } from '@mui/material';
import { SwapHorizontalIcon } from '@tyro/icons';
import { Colour } from '@tyro/api';

interface SubIconProps {
  size?: 'small' | 'medium' | 'large';
  color?: Colour;
}

const sizeMap = {
  small: {
    container: 14,
    icon: 12,
  },
  medium: {
    container: 16,
    icon: 14,
  },
  large: {
    container: 18,
    icon: 16,
  },
} as const;

export function SubIcon({
  size = 'medium',
  color = Colour.Green,
}: SubIconProps) {
  const { container, icon } = sizeMap[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundColor: `${color}.main`,
        borderRadius: '50%',
        width: container,
        height: container,

        '& svg': {
          width: icon,
          height: icon,
          transform: 'rotate(-45deg)',
          '& path': {
            strokeWidth: 2,
          },
        },
      }}
    >
      <SwapHorizontalIcon />
    </Box>
  );
}
