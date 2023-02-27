/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Divider, Typography } from '@mui/material';
//
import { Scrollbar } from '@tyro/core';
import { Mail, MailReadInput } from '@tyro/api';
import Markdown from '../../../../src/components/Markdown';
import MailDetailsToolbar from './MailDetailsToolbar';
import MailDetailsReplyInput from './MailDetailsReplyInput';
import { useReadMail } from '../api/mails';
import { MailLabel } from '../types';
import { MailDetailsAttachments } from '.';

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

interface MailDetailProps {
  mail: Mail | null;
  activeLabelName: string;
  labels: MailLabel[];
}

// ----------------------------------------------------------------------

export default function MailDetails({
  mail,
  activeLabelName,
  labels,
}: MailDetailProps) {
  const { mutate: readMail } = useReadMail();

  useEffect(() => {
    if (
      mail &&
      !mail?.readOn &&
      !mail.labels?.filter((label) => label?.id === 2).length
    ) {
      const readInput: MailReadInput = {
        mailId: mail.id,
        threadId: mail.threadId,
      };
      readMail(readInput);
    }
  }, [mail, activeLabelName]);

  if (!mail) {
    return null;
  }

  return (
    <RootStyle>
      <MailDetailsToolbar
        mail={mail}
        labels={labels}
        activeLabelName={activeLabelName}
      />

      <Divider />

      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" gutterBottom>
            {mail.subject}
          </Typography>
          <MarkdownStyle>
            <Markdown>{mail?.body || ''}</Markdown>
          </MarkdownStyle>
        </Box>
      </Scrollbar>

      {/* {isAttached && <MailDetailsAttachments mail={mail} />} */}

      <Divider />

      <MailDetailsReplyInput mail={mail} />
    </RootStyle>
  );
}