import { Box, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

export function AdditionalInfo() {
  const { t } = useTranslation(['people']);

  const additionalInfoList = {
    [t('people:year')]: 3,
    [t('people:class')]: '1A5',
    [t('people:yearHead')]: 'Mrs. Feelan',
    [t('people:tutor')]: 'Mrs. Keegan',
  };

  return (
    <Stack component="dl" direction="row" sx={{ my: 0 }}>
      {Object.entries(additionalInfoList).map(([label, value], index) => (
        <Stack key={label}>
          <Box
            component="dt"
            sx={{
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
              color: 'slate.600',
              minHeight: 34,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {label}
          </Box>
          <Box
            component="dd"
            sx={{
              fontSize: '0.75rem',
              ml: 0,
              py: 1,
              px: 2,
              ...(index < 2 && {
                textAlign: 'center',
              }),
            }}
          >
            {value}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
