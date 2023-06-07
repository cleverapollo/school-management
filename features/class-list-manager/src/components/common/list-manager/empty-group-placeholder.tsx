import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

interface EmptyGroupPlaceholderProps {
  sx: BoxProps['sx'];
}

export function EmptyGroupPlaceholder({ sx }: EmptyGroupPlaceholderProps) {
  const { t } = useTranslation(['classListManager']);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px dashed',
        height: 50,
        borderRadius: 1,
        mb: 1,
        ...sx,
      }}
    >
      <Typography
        component="span"
        variant="subtitle2"
        sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
      >
        {t('classListManager:noStudents')}
      </Typography>
    </Box>
  );
}
