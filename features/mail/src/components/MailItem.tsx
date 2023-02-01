/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Tooltip, Typography, Checkbox } from '@mui/material';
// hooks
import { useUser, Mail } from '@tyro/api';
import { useResponsive, Avatar } from '@tyro/core';
// utils
import { fDate } from '../../../../src/utils/formatTime';
// @types
import {
  // Mail,
  MailLabel,
} from '../types';
// components
import Label from '../../../../src/components/Label';
import { Iconify } from '../../../../src/components/iconify';
//
import MailItemAction from './MailItemAction';
import { useStarMail } from '../api/mails';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

type Props = {
  mail: Mail;
  isDense: boolean;
  isSelected: boolean;
  onDeselect: VoidFunction;
  onSelect: VoidFunction;
  labels?: MailLabel[];
};

export default function MailItem({
  mail,
  isDense,
  isSelected,
  onSelect,
  onDeselect,
  labels,
  ...other
}: Props) {
  const { user } = useUser();

  const isDesktop = useResponsive('up', 'md');

  // ToDO: refactor isAttached when attachments will be implemented
  const isAttached = false;

  const handleChangeCheckbox = (checked: boolean) =>
    checked ? onSelect() : onDeselect();

  const { mutate: starMail } = useStarMail();
  const onStarMail = () => {
    starMail({
      mailId: mail.id,
      threadId: mail.threadId,
      starred: !mail.starred,
    });
  };

  return (
    <RootStyle
      sx={{
        ...((!!mail.readOn ||
          !!mail.labels?.filter((label) => label?.id === 2).length ||
          (user?.profiles &&
            user.profiles[0].partyId === mail.senderPartyId)) && {
          color: 'text.primary',
          backgroundColor: 'background.paper',
        }),
        ...(isSelected && { bgcolor: 'action.selected' }),
      }}
      {...other}
    >
      {isDesktop && (
        <Box sx={{ mr: 2, display: 'flex' }}>
          <Checkbox
            checked={isSelected}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeCheckbox(event.target.checked)
            }
          />
          <Tooltip title="Starred">
            <Checkbox
              color="warning"
              onChange={onStarMail}
              defaultChecked={!!mail.starred}
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
            />
          </Tooltip>
        </Box>
      )}

      <RouterLink
        to={`/mail/${mail.id}`}
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <Box
          sx={{
            py: 2,
            minWidth: 0,
            display: 'flex',
            transition: (theme) => theme.transitions.create('padding'),
            ...(isDense && { py: 1 }),
          }}
        >
          <Avatar
            name={mail.senderPartyId?.toString()}
            sx={{ width: 32, height: 32 }}
          />

          <Box
            sx={{
              ml: 2,
              minWidth: 0,
              alignItems: 'center',
              display: { md: 'flex' },
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                pr: 2,
                minWidth: 200,
                ...((!!mail.readOn ||
                  !!mail.labels?.filter((label) => label?.id === 2).length ||
                  (user?.profiles &&
                    user.profiles[0].partyId === mail.senderPartyId)) && {
                  fontWeight: 'fontWeightBold',
                }),
              }}
            >
              {mail.senderPartyId}
            </Typography>

            <Typography
              noWrap
              variant="body2"
              sx={{
                pr: 2,
              }}
            >
              <Box
                component="span"
                sx={{
                  ...((!!mail.readOn ||
                    !!mail.labels?.filter((label) => label?.id === 2).length ||
                    (user?.profiles &&
                      user.profiles[0].partyId === mail.senderPartyId)) && {
                    fontWeight: 'fontWeightBold',
                  }),
                }}
              >
                {mail.subject}
              </Box>
              &nbsp;-&nbsp;
              <Box
                component="span"
                sx={{
                  ...((!!mail.readOn ||
                    !!mail.labels?.filter((label) => label?.id === 2).length ||
                    (user?.profiles &&
                      user.profiles[0].partyId === mail.senderPartyId)) && {
                    color: 'text.secondary',
                  }),
                }}
              >
                {mail.body}
              </Box>
            </Typography>

            {isDesktop && (
              <>
                <Box sx={{ display: 'flex' }}>
                  {mail.labels?.map((labelId) => {
                    const label = labels?.find(
                      (mailLabel) =>
                        labelId?.id && mailLabel.id === String(labelId?.id)
                    );
                    if (!label) return null;
                    return (
                      <Label
                        key={label.id}
                        sx={{
                          mx: 0.5,
                          textTransform: 'capitalize',
                          bgcolor: label.color,
                          color: (theme) =>
                            theme.palette.getContrastText(label.color || ''),
                        }}
                      >
                        {label.name}
                      </Label>
                    );
                  })}
                </Box>

                {isAttached && (
                  <Iconify
                    icon="eva:link-fill"
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
                flexShrink: 0,
                minWidth: 120,
                textAlign: 'right',
                ...((!!mail.readOn ||
                  !!mail.labels?.filter((label) => label?.id === 2).length ||
                  (user?.profiles &&
                    user.profiles[0].partyId === mail.senderPartyId)) && {
                  fontWeight: 'fontWeightBold',
                }),
              }}
            >
              {fDate(mail.sentOn)}
            </Typography>
          </Box>
        </Box>
      </RouterLink>

      <MailItemAction className="showActions" />
    </RootStyle>
  );
}
