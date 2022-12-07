// @mui
import { Avatar, Button, Paper, IconButton, Typography, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { ExtendedEventInput } from '../api/getEvents';
import Close from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { CheckOutlined, EmailOutlined, EventOutlined, GroupOutlined, LocationOnOutlined } from '@mui/icons-material';

// ----------------------------------------------------------------------

type IProps = {
  event: ExtendedEventInput;
  onCancel: () => void;
  isEditable: boolean;
};

const CalendarEventView = ({ event, onCancel, isEditable }: IProps) => {
  return (
    <Paper sx={{ padding: '30px' }}>
      <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
        <IconButton onClick={onCancel}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '30px', paddingLeft: '4px' }}>
        <Box sx={{ backgroundColor: `${event.backgroundColor}`, width: '20px', height: '20px', borderRadius: '4px' }}/>
        <Typography variant="h5" sx={{ marginLeft: '20px' }}>{isEditable ? event.teacherTitle : event.title}</Typography>
      </Box>
      <Box sx={{ paddingLeft: '44px', marginTop: '5px' }}>
        {format(new Date(event.start as Date), 'EEEE, d LLLL K:mm') + format(new Date(event.end as Date), '- p')}
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center', marginTop: '25px', marginBottom: '30px'}}>
        <LocationOnOutlined/>
        <Typography sx={{marginLeft: '20px'}}>{event.room}</Typography>
      </Box>
      {isEditable && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <GroupOutlined />
        <Box sx={{ marginLeft: '20px' }}>
          <Typography>{event.participants.length + ' guests'}</Typography>
          <Typography variant="body2">{'1 yes'}</Typography>
          <Typography variant="body2">{`${event.participants.length - 1} awaiting`}</Typography>
        </Box>
        </Box>
        <EmailOutlined />
      </Box>}
      <Box sx={{ paddingLeft: '44px', marginTop: '10px' }}>
        {event.participants.map((participant, index) => {
          return <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '10px' }}>
            <Avatar src="google.com" alt={participant.partyInfo?.name || '' + participant.partyInfo?.firstName + ' ' + participant.partyInfo?.lastName} />
            {isEditable && index === 0 && <div style={{width: '22px', height: '22px', background: 'lightsteelblue', position: 'absolute', borderRadius: '50px', color: 'green', top: '22px', left: '22px'}}><CheckOutlined /></div>}
            <Box sx={{ marginLeft: '10px' }}>{participant.partyInfo?.name || '' + participant.partyInfo?.firstName + ' ' + participant.partyInfo?.lastName}</Box>
          </Box>
        })}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '25px', marginBottom: '10px' }}>
        <EventOutlined />
        <Box sx={{ marginLeft: '25px' }}>
          {isEditable && <Typography>{event.organizer}</Typography>}
          <Typography variant="body2">Academic Calendar</Typography>
        </Box>
      </Box>
      {isEditable && <>
        <Divider />
        <Box sx={{ marginTop: '10px', textAlign: 'right' }}>
          <Button variant="outlined" color="success" onClick={() => {}} sx={{ marginRight: '16px' }}>
            View
          </Button>
          <Button variant="contained" color="success" onClick={() => {}}>
            <strong style={{ color: 'white' }}>Attendance</strong>
          </Button>
        </Box>
      </>}
    </Paper>
  );
}

export default CalendarEventView;
