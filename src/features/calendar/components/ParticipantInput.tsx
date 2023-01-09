// @mui
import { Avatar, Button, MenuItem, Popover, IconButton, Typography } from '@mui/material';
import { Participant } from './CalendarForm';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { CalendarEventAttendeeType } from '@tyro/api';
import Close from '@mui/icons-material/Close';

// ----------------------------------------------------------------------

type IProps = {
  participants: Participant[];
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
};

//ToDo: remove this when search api for participants will be implemented
const MENU_OPTIONS: Participant[] = [
  {
    "partyId": "614",
    "type": CalendarEventAttendeeType.Additional,
  },
  {
    "partyId": "615",
    "type": CalendarEventAttendeeType.Additional,
  },
  {
    "partyId": "616",
    "type": CalendarEventAttendeeType.Additional,
  },
  {
    "partyId": "617",
    "type": CalendarEventAttendeeType.Additional,
  },
  {
    "partyId": "618",
    "type": CalendarEventAttendeeType.Additional,
  },
  {
    "partyId": "619",
    "type": CalendarEventAttendeeType.Additional,
  },
  {
    "partyId": "620",
    "type": CalendarEventAttendeeType.Additional,
  },
];

const ParticipantInput = ({ participants, setParticipants }: IProps) => {

  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [isOpenParticipantsModal, setIsOpenParticipantsModal] = useState<boolean>(false);
  const buttonRef = useRef(null);
  const participantsRef = useRef(null);

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(participant => participant.partyId !== id));
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent:'space-between', 
      height: '56px', 
      padding: '0 14px', 
      borderRadius: '8px', 
      border: '1px solid rgba(33, 43, 54, 0.2)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {participants.map((participant, index) => index < 3 && <Avatar src="google.com" alt={participant.partyId}/>)}
          {participants.length > 3 && 
            <div style={{
              background: 'lightgreen', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}>
              {`+${participants.length - 3}`}
            </div>
          }
        </Box>
        <Box sx={{ marginLeft: '20px' }} onClick={() => setIsOpenParticipantsModal(true)} ref={participantsRef}>
          {participants.length + ' participants >'}
        </Box>
      </Box>
      <Button onClick={() => setOpenSelect(true)} ref={buttonRef}>
        {'+ Add More'}
      </Button>
      <Popover
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setOpenSelect(false)}
        anchorEl={buttonRef.current}
        open={openSelect}
      >
        <Stack sx={{ p: 1, width: '280px' }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.partyId}
              onClick={() => setParticipants([...participants, option])}
              disabled={participants.includes(option)}
            >
              <Avatar src="google.com" alt={participants.includes(option) ? 'V' : option.partyId} sx={{ marginRight: '20px' }} />
              {option.partyId}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
      <Popover
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setIsOpenParticipantsModal(false)}
        anchorEl={participantsRef.current}
        open={isOpenParticipantsModal}
      >
        <Box sx={{ padding: '20px 20px 0 '}}>
        <Typography variant="h4">Participants</Typography>
        <Typography variant="body1">{`You have invited ${participants.length} participants`}</Typography>
        </Box>
        <Stack sx={{ p: 1, width: '280px', padding: '10px 0px' }}>
          {participants.map((option) => (
            <MenuItem
              key={option.partyId}
              onClick={() => setParticipants([...participants, option])}
              sx={{ marginBottom: '5px' }}
            >
              <Avatar src="google.com" alt={option.partyId} sx={{ marginRight: '20px' }} />
              {option.partyId}
              <Box sx={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => removeParticipant(option.partyId)}>
                <IconButton>
                  <Close />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </Box>
  );
}

export default ParticipantInput;
