import { memo, useMemo, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Colour, RecipientInput } from '@tyro/api';
import { Avatar, DialogCloseButton, SearchInput } from '@tyro/core';
import { TrashIcon } from '@tyro/icons';
import { useVirtualizer } from '@tanstack/react-virtual';

export type RecipientsForSmsModal = Array<{
  name: string;
  id: RecipientInput['recipientPartyId'];
  type: 'individual' | 'group';
  avatarUrl?: string | null;
  avatarColor?: Colour | null;
}>;

interface RecipientListProps {
  recipients: RecipientsForSmsModal | undefined;
  initialRecipientAmount: number;
  removeRecipient: (id: RecipientInput['recipientPartyId']) => void;
  onClose: () => void;
}

function RecipientListInner({
  recipients,
  initialRecipientAmount,
  removeRecipient,
  onClose,
}: RecipientListProps) {
  const recipientContainerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const { t } = useTranslation(['common', 'sms']);
  const { spacing } = useTheme();

  const disableRemoveButton = (recipients?.length ?? 0) <= 1;
  const showSearch = initialRecipientAmount > 10;

  const filteredRecipients = useMemo(() => {
    if (!recipients) return [];
    if (!search) return recipients;

    const lowerCaseSearch = search.toLowerCase();
    return recipients?.filter((recipient) =>
      recipient.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [recipients, search]);

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
      <Stack
        direction="row"
        p={3}
        pr={8}
        alignItems="center"
        justifyContent="space-between"
        position="relative"
      >
        <Typography component="h3" variant="h6">
          {t('sms:recipient', { count: recipients?.length ?? 0 })}
          <Typography
            component="span"
            variant="body1"
            sx={{ ml: 1, color: 'text.secondary' }}
          >
            {t('common:selectedWithNumber', { count: recipients?.length ?? 0 })}
          </Typography>
        </Typography>
        <DialogCloseButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 24,
            backgroundColor: 'slate.200',
            '&:hover': {
              backgroundColor: 'slate.300',
            },
          }}
        />
      </Stack>
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
              '@media (hover: hover) and (pointer: fine)': {
                '& li button': {
                  opacity: 0,
                },

                '& li:focus-within, & li:hover': {
                  bgcolor: 'primary.lighter',

                  '& button': {
                    opacity: 1,
                  },
                },
              },
            }}
          >
            {virtualRecipients.map((virtualRow) => {
              const { id, name, type, avatarUrl, avatarColor } =
                filteredRecipients[virtualRow.index];
              const bgColorStyle = avatarColor
                ? { bgcolor: `${avatarColor}.500` }
                : {};
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
                    justifyContent: 'space-between',
                    position: 'absolute',
                    top: 0,
                    left: spacing(1),
                    width: 'calc(100% - 16px)',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={avatarUrl}
                      name={name}
                      sx={{
                        my: 1,
                        mr: 1.5,
                        ...(type === 'group' && { borderRadius: 1 }),
                        ...bgColorStyle,
                      }}
                    />
                    <Typography component="span" variant="subtitle2">
                      {name}
                    </Typography>
                  </Box>

                  <Tooltip
                    title={
                      disableRemoveButton
                        ? t('sms:youMustHaveAtLeastOneRecipient')
                        : t('sms:removeRecipient')
                    }
                  >
                    <span>
                      <IconButton
                        aria-label={t('sms:removeRecipient')}
                        onClick={() => removeRecipient(id)}
                        disabled={disableRemoveButton}
                        color="primary"
                      >
                        <TrashIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
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
              src="/assets/illustrations/illustration-user-cloud.svg"
            />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export const RecipientList = memo(RecipientListInner, (oldProps, newProps) => {
  const isEqualRecipients = oldProps.recipients === newProps.recipients;

  return isEqualRecipients;
});
