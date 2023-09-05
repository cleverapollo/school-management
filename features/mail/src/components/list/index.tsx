import { useState } from 'react';
import { Divider, Box, Typography } from '@mui/material';
import { Scrollbar } from '@tyro/core';
import { useUser } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router';
import MailItem from './item';
import MailToolbar from './toolbar';
import { useMailList } from '../../api/mails';
import { getLabelIdNumber } from '../../constants';

export default function MailList() {
  const { t } = useTranslation(['mail']);
  const { activeProfile } = useUser();
  const { labelId } = useParams<{ labelId: string }>();

  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedMails, setSelectedMails] = useState(new Set<number>());

  const {
    data: mails,
    isLoading,
    isRefetching,
  } = useMailList(getLabelIdNumber(labelId ?? 0), activeProfile?.partyId);

  console.log({
    mails,
    labelId: getLabelIdNumber(labelId ?? 0),
    partyId: activeProfile?.partyId,
  });

  const isEmpty = !mails || mails.length === 0;

  const onToggleAll = () => {
    setSelectedMails((prevSelectedMails) => {
      if (!mails || mails.length === prevSelectedMails.size) {
        return new Set();
      }
      return new Set(mails.map((mail) => mail?.id ?? 0));
    });
  };

  const toggleMailSelection = (mailId: number) => {
    setSelectedMails((prevSelectedMails) => {
      if (prevSelectedMails.has(mailId)) {
        prevSelectedMails.delete(mailId);
      } else {
        prevSelectedMails.add(mailId);
      }
      return new Set(prevSelectedMails);
    });
  };

  const onRequestRefresh = () => {
    // TODO add refresh ability
  };

  const isSomeSelected = selectedMails.size > 0;
  const isAllSelected = isSomeSelected && mails?.length === selectedMails.size;

  return (
    <Box flexGrow={1} display="flex" overflow="hidden" flexDirection="column">
      <MailToolbar
        onRequestRefresh={onRequestRefresh}
        onToggleAll={onToggleAll}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        isRefreshing={isRefetching}
      />

      <Divider />

      {!isEmpty ? (
        <Scrollbar>
          <Box sx={{ minWidth: { md: 800 } }}>
            {/* {filteredMailsIds.map(
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
                    mail={mails.byId[mailId]}
                    isSelected={selectedMails.includes(mailId)}
                    onSelect={() => handleSelectOneMail(mailId)}
                    onDeselect={() => handleDeselectOneMail(mailId)}
                    labels={labels}
                  />
                )
            )} */}
          </Box>
        </Scrollbar>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Box
            component="img"
            loading="lazy"
            alt={t('mail:emptyContentTitle')}
            src="/assets/illustrations/illustration_empty_mail.svg"
            sx={{ height: 240, mb: 3 }}
          />
          <Typography variant="h5" gutterBottom>
            {t('mail:emptyContentTitle')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
