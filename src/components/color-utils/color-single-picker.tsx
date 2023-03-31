// @mui
import { Box, Radio, RadioGroup, BoxProps, RadioGroupProps } from '@mui/material';
import { Colour } from '@tyro/api';
// components
import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  colors: Colour[];
}

export default function ColorSinglePicker({ colors, ...other }: Props) {
  return (
    <RadioGroup row {...other}>
      {colors.map((color) => {
        return (
          <Radio
            key={color}
            value={color}
            color="default"
            icon={
              <IconColor />
            }
            checkedIcon={
              <IconColor
                sx={{
                  transform: 'scale(1.4)',
                  '&:before': {
                    opacity: 0.48,
                    width: '100%',
                    content: "''",
                    height: '100%',
                    borderRadius: '50%',
                    position: 'absolute',
                    boxShadow: '4px 4px 8px 0 currentColor',
                  },
                  '& svg': { width: 12, height: 12, color: 'common.white' },
                }}
              />
            }
            sx={{
              color: `${color}.500`,
              '&:hover': { opacity: 0.72 },
            }}
          />
        );
      })}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------

function IconColor({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        display: 'flex',
        borderRadius: '50%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'currentColor',
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
        ...sx,
      }}
      {...other}
    >
      <Iconify icon={'eva:checkmark-fill'} />
    </Box>
  );
}
