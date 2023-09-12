import { Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useMail } from '../../api/mails';
import { MailViewToolbar } from './toolbar';

export function MailView() {
  const { mailId } = useParams<{ mailId: string }>();
  const mailIdNumber = Number(mailId);

  const { data: mail } = useMail(mailIdNumber);

  return (
    <Box flexGrow={1} display="flex" overflow="hidden" flexDirection="column">
      <MailViewToolbar mail={mail} />
      <Divider />
    </Box>
  );
}
