import { useParams } from 'react-router-dom';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Divider, Box } from '@mui/material';
// redux
import { RootState, useDispatch, useTypedSelector } from '../../../store/store';
import { getMails, objFromArray } from '../../../store/slices/mail';
// components
import Scrollbar from '../../../components/Scrollbar';
import EmptyContent from '../../../components/EmptyContent';
//
import MailItem from './MailItem';
import MailToolbar from './MailToolbar';
//import { Mail, MailState } from '../types';
import { useMails } from '../api/mails';
import { MailLabel, Mails } from '../types';
import { Mail as MailType } from '@tyro/api/src/gql/graphql';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
});

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: VoidFunction;
  labels?: MailLabel[];
  mails: Mails;
  activeLabelName: string;
  //setMail: Dispatch<SetStateAction<MailType | null>>;
};

export default function MailList({ onOpenSidebar, labels, mails, activeLabelName }: Props) {
  const { labelId, labelName } = useParams();
  const dispatch = useDispatch();
  //const { mails } = useTypedSelector((state: RootState) => state.mail);
  //const { isLoading, data } = useMails();
  //console.log('data - ', data);
  //const [mails, setMails] = useState<Mails>({ byId: {}, allIds: [] });
  console.log('mails - ', mails);

  // useEffect(() => {
  //   data && setMails({ byId: objFromArray(data), allIds: Object.keys(objFromArray(data)) });
  // }, [data]);

  const [selectedMails, setSelectedMails] = useState<string[]>([]);
  const [dense, setDense] = useState(false);

  const isEmpty = mails.allIds.length < 1;

  // useEffect(() => {
  //   dispatch(getMails(params as Record<string, string>));
  // }, [dispatch, params]);

  const handleSelectAllMails = () => {
    setSelectedMails(mails.allIds.map((mailId) => mailId));
  };

  const handleToggleDense = () => {
    setDense((prev) => !prev);
  };

  const handleDeselectAllMails = () => {
    setSelectedMails([]);
  };

  const handleSelectOneMail = (mailId: string) => {
    setSelectedMails((prevSelectedMails) => {
      if (!prevSelectedMails.includes(mailId)) {
        return [...prevSelectedMails, mailId];
      }
      return prevSelectedMails;
    });
  };

  const handleDeselectOneMail = (mailId: string) => {
    setSelectedMails((prevSelectedMails) => prevSelectedMails.filter((id) => id !== mailId));
  };

  //mails.allIds.forEach((mailId) => console.log(mails.byId[mailId].labels?.filter(label => (activeLabelName && (label?.name.toLowerCase() === activeLabelName.toLowerCase() || (activeLabelName === 'sent' && label?.name === 'Outbox'))))));
  //console.log(mails.allIds.map((mailId) => !!mails.byId[mailId].labels?.filter(label => (activeLabelName && label?.name.toLowerCase() === activeLabelName.toLowerCase()))).length);

  return (
    <RootStyle>
      <MailToolbar
        mails={mails.allIds.length}
        selectedMails={selectedMails.length}
        onSelectAll={handleSelectAllMails}
        onOpenSidebar={onOpenSidebar}
        onDeselectAll={handleDeselectAllMails}
        onToggleDense={handleToggleDense}
      />

      <Divider />

      {!isEmpty ? (
        <Scrollbar>
          <Box sx={{ minWidth: { md: 800 } }}>
            {mails.allIds.map((mailId) => (!!mails.byId[mailId].labels?.filter(label => (activeLabelName && (label?.name.toLowerCase() === activeLabelName.toLowerCase() || (activeLabelName === 'sent' && label?.name === 'Outbox')))).length || (mails.byId[mailId].starred && activeLabelName === 'Starred')) && //!!mails.byId[mailId].labels?.filter(label => (labelId && label?.id === labelId) || (labelName && label?.name === labelName)).length &&
            (
              <MailItem
                key={mailId}
                isDense={dense}
                mail={mails.byId[mailId]}
                isSelected={selectedMails.includes(mailId)}
                onSelect={() => handleSelectOneMail(mailId)}
                onDeselect={() => handleDeselectOneMail(mailId)}
                labels={labels}
              />
            ))}
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent
          title="There is no conversation"
          img="/assets/illustrations/illustration_empty_mail.svg"
          sx={{ flexGrow: 1, height: 'auto' }}
        />
      )}
    </RootStyle>
  );
}
