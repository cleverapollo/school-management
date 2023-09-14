import { Link } from 'react-router-dom';
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
import { ReturnTypeUseMailList, useStarMail } from '../../api/mails';
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
    boxShadow: theme.customShadows.z24,
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
  const highlightMail = !mail.readOn;

  const isDesktop = useResponsive('up', 'md');

  // ToDO: refactor isAttached when attachments will be implemented
  const isAttached = false;

  return (
    <RootStyle
      sx={{
        ...(highlightMail && {
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
      {isDesktop && (
        <Box sx={{ mr: 2, display: 'flex' }}>
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect(mail.id)}
          />
          <StarMail isStarred={!!mail.starred} mail={mail} />
        </Box>
      )}

      <Link
        to={`view/${mail.id}`}
        relative="path"
        style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}
      >
        <Box
          sx={{
            py: 2,
            display: 'flex',
            flex: 1,
          }}
        >
          <Avatar
            name={mail.senderPartyId?.toString()}
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
            sx={{
              ml: 2,
              flex: 1,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                minWidth: 180,
                ...(highlightMail && {
                  fontWeight: '700',
                }),
              }}
            >
              {isSentLabel
                ? mail.outboxRecipientSummary
                : mail.inboxSenderSummary}
            </Typography>

            <Typography noWrap variant="body2" flex="1">
              <Box
                component="span"
                sx={{
                  ...(highlightMail && {
                    fontWeight: '700',
                  }),
                }}
              >
                {mail.subject}
              </Box>{' '}
              -{' '}
              <Box
                component="span"
                sx={{
                  ...(highlightMail && {
                    color: 'text.secondary',
                  }),
                }}
              >
                {mail.summary}
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

                {isAttached && (
                  <LinkIcon
                    sx={{
                      mx: 2,
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                    }}
                  />
                )}
              </>
            )}

            {mail?.labels?.map(
              (label) =>
                label?.custom && (
                  <Box
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
                ...(highlightMail && {
                  fontWeight: '700',
                }),
              }}
            >
              {getRelativeDateFormat(mail.sentOn)}
            </Typography>
          </Stack>
        </Box>
      </Link>

      <MailItemAction
        mail={mail}
        isRead={!highlightMail}
        className="showActions"
      />
    </RootStyle>
  );
}
