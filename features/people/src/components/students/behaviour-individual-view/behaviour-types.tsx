import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { FolderIcon } from '@tyro/icons';

type BehaviourTypesProps = {
  title: string;
  color: string;
  count: number;
};

export const BehaviourTypes = ({
  color,
  title,
  count,
}: BehaviourTypesProps) => {
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
          borderRadius: '6px',
          backgroundColor: `${color}.100`,
          color: `${color}.500`,
          width: '32px',
          height: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FolderIcon />
      </Box>
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
