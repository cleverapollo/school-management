import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';

type TypesProps = {
  title: string;
  color: string;
  count: number;
  // icon: JSX.Element;
};

export const Types = ({ color, title, count }: TypesProps) => {
  const { t } = useTranslation(['common', 'people']);
  return (
    <Box
      minWidth="137px"
      height="64px"
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: 2,
        '&:last-of-type': { marginRight: '16px' },
      }}
      display="flex"
      alignItems="center"
      marginLeft={2}
      paddingLeft={2}
      paddingRight={2.5}
    >
      <Box
        sx={{
          padding: '6px',
          borderRadius: '6px',
          backgroundColor: `${color}.100`,
          width: '32px',
          height: '32px',
        }}
      />
      <Box flexDirection="column" height="32px" marginLeft="12px">
        <Typography
          sx={{ fontSize: '.875rem', lineHeight: '1rem', fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="slate.400"
          sx={{ fontSize: '0.75rem' }}
          lineHeight="1rem"
        >
          {t('people:totalLogs', { count })}
        </Typography>
      </Box>
    </Box>
  );
};
