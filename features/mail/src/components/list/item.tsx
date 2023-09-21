import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Tooltip,
  Typography,
  Checkbox,
  BoxProps,
  Stack,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useResponsive, Avatar } from '@tyro/core';
import { LinkIcon, StarIcon } from '@tyro/icons';
import { ReturnTypeUseMailList, useMail, useStarMail } from '../../api/mails';
import { useMailSettings } from '../../store/mail-settings';
import { getRelativeDateFormat } from '../../utils/relative-date-format';
import MailItemAction from './actions';
import { StarMail } from '../common/star';

const RootStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' },
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z8,
    '& .showActions': { opacity: 1 },
  },
}));

type MailItemProps = {
  mail: ReturnTypeUseMailList;
  isSelected: boolean;
  onToggleSelect: (mailId: number) => void;
  sx?: BoxProps['sx'];
  isSentLabel?: boolean;
};

export default function MailItem({
  mail,
  isSelected,
  onToggleSelect,
  sx,
  isSentLabel,
}: MailItemProps) {
  const { activeProfileId } = useMailSettings();
  const isDesktop = useResponsive('up', 'md');
  const { t } = useTranslation(['mail']);

  const latestThreadSentOn = useMemo(
    () =>
      [...mail.threads]
        .reverse()
        .find((thread) =>
          isSentLabel
            ? thread.sender.partyId === activeProfileId
            : thread.sender.partyId !== activeProfileId
        )?.sentOn ?? mail.sentOn,
    [isSentLabel, mail.threads, mail.sentOn, activeProfileId]
  );

  const recipientsList = isSentLabel
    ? mail.outboxRecipientSummary
    : mail.inboxSenderSummary;
  const firstRecipient = recipientsList[0];

  // ToDO: refactor isAttached when attachments will be implemented
  const isAttached = false;

  return (
    <RootStyle
      sx={{
        ...(mail.isMailUnread && {
          color: 'text.primary',
          backgroundColor: 'background.paper',
        }),
        ...(isSelected && { backgroundColor: 'action.selected' }),
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        ...sx,
      }}
    >
      {/* {isDesktop && (
        <Box sx={{ mr: 2, display: 'flex' }}>
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect(mail.id)}
          />
          <StarMail isStarred={!!mail.starred} mail={mail} />
        </Box>
      )} */}

      <Link
        to={`view/${mail.id}`}
        relative="path"
        style={{
          color: 'inherit',
          textDecoration: 'none',
          flex: 1,
          width: '100%',
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 1, // Remove when checkbox is added
            width: '100%',
            display: 'flex',
            flex: 1,
          }}
        >
          <Avatar
            name={`${firstRecipient?.firstName ?? ''} ${
              firstRecipient?.lastName ?? ''
            }`}
            src={firstRecipient?.avatarUrl}
            sx={{ width: 32, height: 32 }}
          />

          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            spacing={{
              xs: 0,
              md: 2,
            }}
            alignItems={{
              xs: 'flex-start',
              md: 'center',
            }}
            width="calc(100% - 52px)" // Avatar + margin to left
            sx={{
              ml: 2,
              flex: 1,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                width: 180,
                ...(mail.isMailUnread && {
                  fontWeight: '700',
                }),
              }}
            >
              {recipientsList
                .map(({ firstName, lastName, partyId }) =>
                  partyId === activeProfileId
                    ? t('mail:me')
                    : `${firstName ?? ''} ${lastName ?? ''}`
                )
                .join(', ')}
            </Typography>

            <Typography
              noWrap
              variant="body2"
              width={{
                xs: '100%',
                md: 'auto',
              }}
              flex={1}
            >
              <Box
                component="span"
                sx={{
                  ...(mail.isMailUnread && {
                    fontWeight: '700',
                  }),
                }}
              >
                {mail.subject}
              </Box>
              {' - '}
              <Box
                component="span"
                sx={{
                  ...(mail.isMailUnread && {
                    color: 'text.secondary',
                  }),
                }}
              >
                {isSentLabel ? mail.outboxSummary : mail.inboxSummary}
              </Box>
            </Typography>

            {isDesktop && (
              <>
                {/* <Box sx={{ display: 'flex' }}>
                  {mail.labels?.map((label) => {
                    return (
                      <Label
                        key={label.id}
                        sx={(theme) => ({
                          mx: 0.5,
                          bgcolor: label.colour,
                          color: label.colour
                            ? theme.palette.getContrastText(label.colour)
                            : 'inherit',
                        })}
                      >
                        {label.name}
                      </Label>
                    );
                  })}
                </Box> */}

                {/* {isAttached && (
                  <LinkIcon
                    sx={{
                      mx: 2,
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                    }}
                  />
                )} */}
              </>
            )}

            {mail?.labels?.map(
              (label) =>
                label?.custom && (
                  <Box
                    key={label.id}
                    sx={{
                      bgcolor: label.colour,
                      padding: '1px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {label.name}
                  </Box>
                )
            )}

            <Typography
              variant="caption"
              sx={{
                textAlign: 'right',
                ...(mail.isMailUnread && {
                  fontWeight: '700',
                }),
              }}
            >
              {getRelativeDateFormat(latestThreadSentOn)}
            </Typography>
          </Stack>
        </Box>
      </Link>

      {/* <MailItemAction
        mail={mail}
        isRead={!mail.isMailUnread}
        className="showActions"
      /> */}
    </RootStyle>
  );
}
