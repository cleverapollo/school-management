/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import {
  Box,
  Button,
  Paper,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { Avatar } from '@tyro/core';
import {
  Close,
  CheckOutlined,
  EmailOutlined,
  EventOutlined,
  GroupOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import { Maybe } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { DialogAnimate } from '../../../../../../src/components/animate';
import { ExtendedEventInput } from '../../../api/events';

// ----------------------------------------------------------------------

type CalendarEventViewProps = {
  event?: Maybe<ExtendedEventInput>;
  onCancel: () => void;
  isEditable: boolean;
};

const CalendarEventView = ({
  event,
  onCancel,
  isEditable,
}: CalendarEventViewProps) => {
  const { t } = useTranslation(['calendar', 'common']);

  return (
    <DialogAnimate
      open={!!event}
      onClose={onCancel}
      sx={{ maxWidth: '750px !important' }}
    >
      {!!event && (
        <Paper sx={{ padding: '30px' }}>
          <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
            <IconButton onClick={onCancel}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '30px',
              paddingLeft: '4px',
            }}
          >
            <Box
              sx={{
                backgroundColor: `${event.backgroundColor ?? 'transparent'}`,
                width: '20px',
                height: '20px',
                borderRadius: '4px',
              }}
            />
            <Typography variant="h5" sx={{ marginLeft: '20px' }}>
              {isEditable ? event.teacherTitle : event.title}
            </Typography>
          </Box>
          <Box sx={{ paddingLeft: '44px', marginTop: '5px' }}>
            {dayjs(new Date(event.start as Date)).format('dddd, D MMMM h:mm ') +
              dayjs(new Date(event.end as Date)).format('- h:mm a')}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '25px',
              marginBottom: '30px',
            }}
          >
            <LocationOnOutlined />
            <Typography sx={{ marginLeft: '20px' }}>{event.room}</Typography>
          </Box>
          {isEditable && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupOutlined />
                <Box sx={{ marginLeft: '20px' }}>
                  <Typography>{`${event.participants.length} ${t(
                    'calendar:guests'
                  )}`}</Typography>
                  <Typography variant="body2">{`1 ${t(
                    'calendar:yes'
                  )}`}</Typography>
                  <Typography variant="body2">{`${
                    event.participants.length - 1
                  } ${t('calendar:awaiting')}`}</Typography>
                </Box>
              </Box>
              <EmailOutlined />
            </Box>
          )}
          <Box sx={{ paddingLeft: '44px', marginTop: '10px' }}>
            {event.participants.map((participant, index) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  marginBottom: '10px',
                }}
              >
                <Avatar
                  src="google.com"
                  name={
                    participant.partyInfo?.name ||
                    `${participant.partyInfo?.firstName ?? ''} ${
                      participant.partyInfo?.lastName ?? ''
                    }`
                  }
                />
                {isEditable && index === 0 && (
                  <Box
                    sx={{
                      width: '22px',
                      height: '22px',
                      background: 'lightsteelblue',
                      position: 'absolute',
                      borderRadius: '50px',
                      color: 'green',
                      top: '22px',
                      left: '22px',
                    }}
                  >
                    <CheckOutlined />
                  </Box>
                )}
                <Box sx={{ marginLeft: '10px' }}>
                  {participant.partyInfo?.name ||
                    `${participant.partyInfo?.firstName ?? ''} ${
                      participant.partyInfo?.lastName ?? ''
                    }`}
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '25px',
              marginBottom: '10px',
            }}
          >
            <EventOutlined />
            <Box sx={{ marginLeft: '25px' }}>
              {isEditable && <Typography>{event.organizer}</Typography>}
              <Typography variant="body2">
                {t('calendar:academicCalendar')}
              </Typography>
            </Box>
          </Box>
          {isEditable && (
            <>
              <Divider />
              <Box sx={{ marginTop: '10px', textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => {}}
                  sx={{ marginRight: '16px' }}
                >
                  {t('common:actions.view')}
                </Button>
                <Button variant="contained" color="success" onClick={() => {}}>
                  <strong style={{ color: 'white' }}>
                    {t('calendar:attendance')}
                  </strong>
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}
    </DialogAnimate>
  );
};

export default CalendarEventView;
