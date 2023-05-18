import { memo, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, SearchInput, usePreferredNameLayout } from '@tyro/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ReturnTypeFromUseSentSms } from '../../api/sent-sms';

interface RecipientListProps {
  recipients: NonNullable<ReturnTypeFromUseSentSms>['recipients'] | undefined;
}

function ReadOnlyRecipientListInner({ recipients }: RecipientListProps) {
  const recipientContainerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const { t } = useTranslation(['common', 'sms']);
  const showSearch = Array.isArray(recipients) && recipients?.length > 10;
  const { displayName } = usePreferredNameLayout();
  const { spacing } = useTheme();

  const filteredRecipients = useMemo(() => {
    if (!recipients) return [];
    if (!search) return recipients;

    const lowerCaseSearch = search.toLowerCase();
    return recipients?.filter(({ recipient }) =>
      displayName(recipient).toLowerCase().includes(lowerCaseSearch)
    );
  }, [recipients, search, displayName]);

  const virtualizer = useVirtualizer({
    count: filteredRecipients.length ?? 0,
    getScrollElement: () => recipientContainerRef.current,
    estimateSize: () => 64,
    overscan: 4,
    paddingStart: showSearch ? 8 : 0,
    paddingEnd: showSearch ? 8 : 0,
  });

  const virtualRecipients = virtualizer.getVirtualItems();

  return (
    <Stack sx={{ flex: 1, bgcolor: 'slate.50' }}>
      <Typography component="h3" variant="h6" sx={{ p: 3 }}>
        {t('sms:recipient', { count: recipients?.length ?? 0 })}
        <Typography
          component="span"
          variant="body1"
          sx={{ ml: 1, color: 'text.secondary' }}
        >
          ({recipients?.length ?? 0})
        </Typography>
      </Typography>
      {showSearch && (
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerProps={{
            px: 2,
          }}
        />
      )}
      <Box
        ref={recipientContainerRef}
        sx={{
          flex: '1 1 0',
          minHeight: spacing(40),
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        {virtualRecipients.length > 0 ? (
          <Box
            component="ul"
            sx={{
              m: 0,
              px: 1,
              position: 'relative',
              width: '100%',
              height: virtualizer.getTotalSize(),
            }}
          >
            {virtualRecipients.map((virtualRow) => {
              const { recipient, smsSuccess } =
                filteredRecipients[virtualRow.index];
              const name = displayName(recipient);
              return (
                <Box
                  key={virtualRow.key}
                  component="li"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: spacing(1),
                    width: 'calc(100% - 16px)',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Avatar
                    src={recipient?.avatarUrl}
                    name={name}
                    sx={{
                      my: 1,
                      mr: 1.5,
                    }}
                  />
                  <Stack>
                    <Typography component="span" variant="subtitle2">
                      {name}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: smsSuccess ? 'primary.main' : 'error.main' }}
                    >
                      {smsSuccess ? t('sms:sent') : t('sms:failed')}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Stack
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            spacing={1}
          >
            <Typography component="h4" variant="body1" color="primary">
              {t('sms:noRecipientsFound')}
            </Typography>
            <img
              alt=""
              src="/assets/illustrations/ illustration-user-cloud.svg"
            />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export const ReadOnlyRecipientList = memo(ReadOnlyRecipientListInner);
