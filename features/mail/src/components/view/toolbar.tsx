import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ChevronLeftIcon, LabelsIcon, TrashIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { ReturnTypeUseMail } from '../../api/mails';
import { StarMail } from '../common/star';

interface MailViewToolbarProps {
  mail: ReturnTypeUseMail | undefined;
}

export function MailViewToolbar({ mail }: MailViewToolbarProps) {
  const { t } = useTranslation(['common', 'mail']);

  return (
    <Box
      sx={{
        height: 84,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <IconButton component={Link} to="../.." relative="path">
          <ChevronLeftIcon />
        </IconButton>

        <Typography component="h2" variant="h5">
          {mail?.subject}
        </Typography>
      </Stack>

      {/* <Stack direction="row" alignItems="center">
        <StarMail isStarred={!!mail?.starred} mail={mail} />
        <Tooltip title={t('mail:labels')}>
          <IconButton size="small" onClick={() => console.log('labels')}>
            <LabelsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('common:delete')}>
          <IconButton size="small" onClick={() => console.log('delete')}>
            <TrashIcon />
          </IconButton>
        </Tooltip>
      </Stack> */}
    </Box>
  );
}
