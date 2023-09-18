import { useTheme } from '@mui/material';
import { VersatileSelectorProps } from 'react-querybuilder';
import { Selector } from './selector';

export const OperatorSelector = (props: VersatileSelectorProps) => {
  const { spacing } = useTheme();

  return (
    <Selector
      {...props}
      sx={{
        maxWidth: spacing(22),
      }}
    />
  );
};
