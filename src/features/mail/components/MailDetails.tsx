import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Divider, Typography } from '@mui/material';
// redux
import { RootState, useDispatch, useTypedSelector } from '../../../store/store';
import { getMail } from '../../../store/slices/mail';
//
import Markdown from '../../../components/Markdown';
import Scrollbar from '../../../components/Scrollbar';
import MailDetailsToolbar from './MailDetailsToolbar';
import MailDetailsReplyInput from './MailDetailsReplyInput';
import MailDetailsAttachments from './MailDetailsAttachments';
import { Mail, MailReadInput } from '@tyro/api/src/gql/graphql';
import { useReadMail } from '../api/mails';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const MarkdownStyle = styled('div')(({ theme }) => ({
  '& > p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
  },
}));

interface IProps{
  mail: Mail | null;
  activeLabelName: string;
}

// ----------------------------------------------------------------------

export default function MailDetails({ mail, activeLabelName }: IProps) {
  //const { mailId = '' } = useParams();

  const dispatch = useDispatch();

  //const mail = useTypedSelector((state: RootState) => state.mail.mails.byId[mailId]);

  //const isAttached = mail && mail.files && mail.files.length > 0;

  // useEffect(() => {
  //   dispatch(getMail(mailId));
  // }, [dispatch, mailId]);

  const readFilter: MailReadInput = {
    mailId: mail?.id,
    threadId: mail?.threadId,
  }

  const readMutation = useReadMail(readFilter);

  useEffect(() => {
    if (mail && !mail?.readOn && activeLabelName !== 'sent') {
      readMutation.mutate();
    }
  }, [mail, activeLabelName]);

  if (!mail) {
    return null;
  }

  return (
    <RootStyle>
      <MailDetailsToolbar mail={mail} />

      <Divider />

      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" gutterBottom>
            {mail.subject}
          </Typography>
          <MarkdownStyle>
            <Markdown children={mail?.body || ''} />
          </MarkdownStyle>
        </Box>
      </Scrollbar>

      {/* {isAttached && <MailDetailsAttachments mail={mail} />} */}

      <Divider />

      <MailDetailsReplyInput />
    </RootStyle>
  );
}
