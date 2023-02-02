/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useState, useMemo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Divider, Box } from '@mui/material';
// components
import { Scrollbar } from '@tyro/core';
import { useUser } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import EmptyContent from '../../../../src/components/EmptyContent';
//
import MailItem from './MailItem';
import MailToolbar from './MailToolbar';

import { MailLabel, Mails } from '../types';

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
};

export default function MailList({
  onOpenSidebar,
  labels,
  mails,
  activeLabelName,
}: Props) {
  const { t } = useTranslation(['mail']);
  const { user } = useUser();
  const [filterValue, setFilterValue] = useState<string>('');
  const filteredMailsIds = useMemo(
    () =>
      mails.allIds.filter(
        (id) =>
          mails.byId[id].body?.includes(filterValue) ||
          mails.byId[id].subject?.includes(filterValue)
      ),
    [mails, filterValue]
  );

  const [selectedMails, setSelectedMails] = useState<string[]>([]);
  const [dense, setDense] = useState(false);

  const isEmpty = mails.allIds.length < 1;

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
    setSelectedMails((prevSelectedMails) =>
      prevSelectedMails.filter((id) => id !== mailId)
    );
  };

  return (
    <RootStyle>
      <MailToolbar
        mails={mails.allIds.length}
        selectedMails={selectedMails.length}
        onSelectAll={handleSelectAllMails}
        onOpenSidebar={onOpenSidebar}
        onDeselectAll={handleDeselectAllMails}
        onToggleDense={handleToggleDense}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />

      <Divider />

      {!isEmpty ? (
        <Scrollbar>
          <Box sx={{ minWidth: { md: 800 } }}>
            {filteredMailsIds.map(
              (mailId) =>
                (!!mails.byId[mailId].labels?.filter(
                  (label) =>
                    activeLabelName &&
                    ((label?.name === activeLabelName && label.custom) ||
                      (activeLabelName === 'sent' &&
                        mails.byId[mailId].senderPartyId ===
                          (user?.profiles && user.profiles[0].partyId)) ||
                      (activeLabelName === 'inbox' &&
                        mails.byId[mailId].senderPartyId !==
                          (user?.profiles && user.profiles[0].partyId)))
                ).length ||
                  (mails.byId[mailId].starred &&
                    activeLabelName === 'Starred')) && (
                  <MailItem
                    key={mailId}
                    isDense={dense}
                    mail={mails.byId[mailId]}
                    isSelected={selectedMails.includes(mailId)}
                    onSelect={() => handleSelectOneMail(mailId)}
                    onDeselect={() => handleDeselectOneMail(mailId)}
                    labels={labels}
                  />
                )
            )}
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent
          title={t('mail:emptyContentTitle')}
          img="/assets/illustrations/illustration_empty_mail.svg"
          sx={{ flexGrow: 1, height: 'auto' }}
        />
      )}
    </RootStyle>
  );
}
