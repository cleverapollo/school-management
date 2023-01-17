import { useRef, useState } from 'react';
// @mui
import { Box, Button, TextField, IconButton } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import { InputMaybe, Mail, SendMailInput, SendMailRecipientInput, useUser } from '@tyro/api';
import { useSendMail } from '../api/mails';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

interface MailDetailsReplyInputProps {
  mail: Mail | null;
}

export default function MailDetailsReplyInput({ mail }: MailDetailsReplyInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();

  const [message, setMessage] = useState('');

  const filter: InputMaybe<SendMailInput> = {
    body: message,
    canReply: true,
    //ToDo: refactor recipients with user names
    recipients: mail?.recipients?.map(recipient => {
      if (recipient?.recipientPartyId === (user?.profiles && user.profiles[0].partyId) ) {
        return {
          recipientPartyId: mail.senderPartyId,
          recipientType: recipient?.recipientType,
        } as SendMailRecipientInput
      }
      return {
        recipientPartyId: recipient?.recipientPartyId,
        recipientType: recipient?.recipientType,
      } as SendMailRecipientInput
    }) || [],
    subject: mail?.subject || '',
    threadId: mail?.threadId,
  };

  const mutation = useSendMail(filter);

  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const onReplyClick = () => {
    mutation.mutate();
    setMessage('');
    enqueueSnackbar('Mail was sent');
  }

  return (
    <>
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={8}
        value={message}
        placeholder="Type a message"
        onChange={handleChangeMessage}
        sx={{ '& fieldset': { border: 'none !important' } }}
      />

      <Box
        sx={{
          mr: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton size="small" onClick={handleAttach}>
          <Iconify icon={'ic:round-add-photo-alternate'} width={24} height={24} />
        </IconButton>

        <IconButton size="small" onClick={handleAttach} sx={{ ml: 1, mr: 2 }}>
          <Iconify icon={'eva:attach-2-fill'} width={24} height={24} />
        </IconButton>

        <Button variant="contained" onClick={onReplyClick}>Send</Button>
      </Box>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </>
  );
}
