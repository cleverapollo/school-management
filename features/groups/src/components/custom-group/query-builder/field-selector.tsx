import { useTheme } from '@mui/material';
import { VersatileSelectorProps } from 'react-querybuilder';
import { Selector } from './selector';

export const FieldSelector = (props: VersatileSelectorProps) => {
  const { spacing } = useTheme();

  return (
    <Selector
      {...props}
      sx={{
        maxWidth: spacing(28),
      }}
    />
  );
};
