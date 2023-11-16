import { useMemo, useEffect, useRef, useState } from 'react';
import { Divider, Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useParams } from 'react-router';
import { useResponsive } from '@tyro/core';
import { LabelType } from '@tyro/api';
import MailItem from './item';
import MailToolbar from './toolbar';
import { useMailList } from '../../api/mails';
import { getLabelById } from '../../utils/labels';
import { useMailSettings } from '../../store/mail-settings';
import { useLabels } from '../../api/labels';

export default function MailList() {
  const { t } = useTranslation(['mail']);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useResponsive('up', 'md');
  const { activeProfileId } = useMailSettings();
  const { labelId } = useParams<{ labelId: string }>();

  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedMails, setSelectedMails] = useState(new Set<number>());
  const { data: labels } = useLabels({
    personPartyId: activeProfileId,
  });
  const matchedLabel = getLabelById(labelId ?? '0', labels);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useMailList(matchedLabel?.originalId ?? 0, activeProfileId);

  const mails = useMemo(() => {
    if (!data?.pages) {
      return [];
    }
    return data.pages.flat();
  }, [data?.pages]);

  const rowVirtualizer = useVirtualizer({
    count: mails?.length ?? 0,
    getScrollElement: () => listRef.current,
    estimateSize: () => (isDesktop ? 64 : 94),
    overscan: 5,
  });

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

  useEffect(() => {
    rowVirtualizer.measure();
  }, [isDesktop]);

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index === mails.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    mails.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  const isEmpty = !mails || mails.length === 0;
  const isSomeSelected = selectedMails.size > 0;
  const isAllSelected = isSomeSelected && mails?.length === selectedMails.size;

  return (
    <Box flexGrow={1} display="flex" overflow="hidden" flexDirection="column">
      <MailToolbar
        onRequestRefresh={refetch}
        onToggleAll={onToggleAll}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        isRefreshing={isRefetching}
      />

      <Divider />

      {!isEmpty ? (
        <Box ref={listRef} sx={{ overflowY: 'auto' }}>
          <Box
            sx={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const mail = mails[virtualItem.index];

              return (
                <MailItem
                  key={virtualItem.key}
                  mail={mail}
                  isSelected={selectedMails.has(mail.id)}
                  onToggleSelect={toggleMailSelection}
                  isSentLabel={matchedLabel?.type === LabelType.Outbox}
                  sx={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                />
              );
            })}
          </Box>
        </Box>
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
