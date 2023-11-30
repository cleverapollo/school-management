import { Box } from '@mui/material';
import { CheckmarkIcon } from '@tyro/icons';
import { RotationStatus } from './types';

const statusStyles = {
  [RotationStatus.Complete]: {
    borderColor: 'green.400',
    backgroundColor: 'green.400',
  },
  [RotationStatus.Active]: {
    borderColor: 'indigo.600',
    backgroundColor: 'indigo.600',
  },
  [RotationStatus.Next]: {
    borderColor: 'slate.300',
    backgroundColor: 'transparent',
  },
  [RotationStatus.Future]: {
    borderColor: 'slate.300',
    backgroundColor: 'transparent',
  },
};

type RotationStatusIconProps = {
  status: RotationStatus;
};

const circleStyle = {
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
};

export const RotationStatusIcon = ({ status }: RotationStatusIconProps) => {
  const { borderColor, backgroundColor } = statusStyles[status];

  return (
    <Box
      sx={{
        ...circleStyle,
        minWidth: 20,
        width: 20,
        height: 20,
        border: '1.5px solid',
        borderColor,
      }}
    >
      <Box
        sx={{
          ...circleStyle,
          minWidth: 12,
          height: 12,
          backgroundColor,
        }}
      >
        {status === RotationStatus.Complete && (
          <CheckmarkIcon
            sx={{
              fontSize: '0.5rem',
              color: 'white',
              '& path': {
                strokeWidth: 4,
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};
