import { useParams, Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Tooltip, Typography, Checkbox } from '@mui/material';
// redux
import { useTypedSelector } from '../../../store/store';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';
import createAvatar from '../../../utils/createAvatar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { //Mail, 
  MailLabel } from '../types';
import { Label as LabelType, Mail, MailStarredInput, MailReadInput } from '@tyro/api/src/gql/graphql';
// components
import Label from '../../../components/Label';
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
//
import MailItemAction from './MailItemAction';
import { Maybe } from 'graphql/jsutils/Maybe';
import { useStarMail, useReadMail } from '../api/mails';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Mail as MailType } from '@tyro/api/src/gql/graphql';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
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

const linkTo = (params: { systemLabel?: string; customLabel?: string }, mailId: string) => {
  const { systemLabel, customLabel } = params;

  const baseUrl = PATH_DASHBOARD.mail.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  if (mailId) {
    return `${baseUrl}?mailId=${mailId}`;
  }
  return baseUrl;
};

type Props = {
  mail: Mail;
  isDense: boolean;
  isSelected: boolean;
  onDeselect: VoidFunction;
  onSelect: VoidFunction;
  labels?: MailLabel[];
  //setMail: Dispatch<SetStateAction<MailType | null>>;
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
  const params = useParams();
  const [isStarred, toggleIsStarred] = useState<boolean | null>(null);

//  const { labels } = useSelector((state) => state.mail);
  console.log('mail - ', mail);
  //const labels: MailLabel[] = [];

  const isDesktop = useResponsive('up', 'md');

  const isAttached = false;//mail?.files?.length > 0;

  const handleChangeCheckbox = (checked: boolean) => (checked ? onSelect() : onDeselect());

  const starFilter: MailStarredInput = {
    mailId: mail.id,
    threadId: mail.threadId,
    starred: !mail.starred,
  }
  const starMutation = useStarMail(starFilter);

  useEffect(() => {
    if(isStarred !== null){ 
      starMutation.mutate();
    }
  }, [isStarred]);

  // const readFilter: MailReadInput = {
  //   mailId: mail.id,
  //   threadId: mail.threadId,
  // }

  // const readMutation = useReadMail(readFilter);

  return (
    <RootStyle
      sx={{
        ...(//!mail.isUnread && {
          //(
            !!mail.readOn  //|| !!mail.labels?.filter(label => label?.id === 2).length) 
            && {
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
              //defaultChecked={mail.isStarred}
              onChange={() => toggleIsStarred(!mail.starred)}
              defaultChecked={!!mail.starred}
              icon={<Iconify icon={'eva:star-outline'} />}
              checkedIcon={<Iconify icon={'eva:star-fill'} />}
            />
          </Tooltip>
          <Tooltip title="Important">
            <Checkbox
              color="warning"
              //defaultChecked={mail.isImportant}
              defaultChecked={false}
              checkedIcon={<Iconify icon={'ic:round-label-important'} />}
              icon={<Iconify icon={'ic:round-label-important'} />}
            />
          </Tooltip>
        </Box>
      )}

      {/* <Box
        component={RouterLink}
        to={`/mail?maildId=${mail.id}`}//linkTo(params, mail.id)}
        sx={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      > */}
      <RouterLink to={`/mail/${mail.id}`} style={{ color: 'inherit', textDecoration: 'none', }}>
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
            alt={mail.senderPartyId?.toString()}
            src={''}
            color={createAvatar(mail.senderPartyId?.toString() ?? '').color}
            sx={{ width: 32, height: 32 }}
          >
            {createAvatar(mail.senderPartyId?.toString() ?? '').name}
          </Avatar>

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
                ...(//!mail.isUnread 
                  !!mail.readOn && { fontWeight: 'fontWeightBold' }),
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
                sx={{ ...(!!mail.readOn && { fontWeight: 'fontWeightBold' }) }}
              >
                {mail.subject}
              </Box>
              &nbsp;-&nbsp;
              <Box
                component="span"
                sx={{
                  ...(!!mail.readOn && { color: 'text.secondary' }),
                }}
              >
                {mail.body}
              </Box>
            </Typography>

            {isDesktop && (
              <>
                <Box sx={{ display: 'flex' }}>
                  {mail.labels?.map((labelId) => {
                    const label = labels?.find((_label) => _label.id === labelId?.id);
                    if (!label) return null;
                    return (
                      <Label
                        key={label.id}
                        sx={{
                          mx: 0.5,
                          textTransform: 'capitalize',
                          bgcolor: label.color,
                          color: (theme) => theme.palette.getContrastText(label.color || ''),
                        }}
                      >
                        {label.name}
                      </Label>
                    );
                  })}
                </Box>

                {isAttached && (
                  <Iconify
                    icon={'eva:link-fill'}
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

            <Typography
              variant="caption"
              sx={{
                flexShrink: 0,
                minWidth: 120,
                textAlign: 'right',
                ...(!!mail.readOn && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {fDate(mail.sentOn)}
            </Typography>
          </Box>
        </Box>
      </RouterLink>
      {/* </Box> */}

      <MailItemAction className="showActions" />
    </RootStyle>
  );
}
