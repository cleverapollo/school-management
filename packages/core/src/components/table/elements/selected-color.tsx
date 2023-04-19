import { Box } from '@mui/material';
import { Colour } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ColorPickerIconColor } from '../../color-picker';

interface TableSelectedColorProps {
  value: Colour | null | undefined;
}

export function TableSelectedColor({ value }: TableSelectedColorProps) {
  const { t } = useTranslation(['common']);
  if (!value) return null;

  return (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          color: `${value}.500`,
          mr: 1,
          mt: -0.25,
        }}
      >
        <ColorPickerIconColor />
      </Box>
      <Box component="span">{t(`common:colors.${value}`)}</Box>
    </Box>
  );
}
