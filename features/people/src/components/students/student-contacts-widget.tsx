import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { AnimatePresence, m } from 'framer-motion';
import {
  ChevronRightIcon,
  ExternalLinkIcon,
  HouseLocationIcon,
  LabelsIcon,
  MailIcon,
  PhoneIcon,
} from '@tyro/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';
import { Avatar } from '@tyro/core';
import { useStudentsContacts } from '../../api/student/overview';
import { joinAddress } from '../../utils/join-address';

interface StudentContactsWidgetProps {
  studentId: number | undefined;
}

export function StudentContactsWidget({
  studentId,
}: StudentContactsWidgetProps) {
  const [contactIndex, setContactIndex] = useState(0);
  const { t } = useTranslation(['common', 'people', 'mail']);
  const { data, isLoading } = useStudentsContacts(studentId);

  const numberOfContacts = data?.contacts?.length ?? 0;
  const contact = data?.contacts?.[contactIndex];
  const contactsRelationshipType =
    contact?.relationships?.[0]?.relationshipType;

  const nextContact = () => {
    const nextContactIndex =
      contactIndex + 1 >= numberOfContacts ? 0 : contactIndex + 1;
    setContactIndex(nextContactIndex);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 380, flex: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 3,
          pr: 2,
          pt: 2.25,
          pb: 1.25,
        }}
      >
        <CardHeader
          component="h3"
          title={t('people:guardianContactInformation')}
          sx={{ p: 0, m: 0 }}
        />
        {contact?.partyId && (
          <IconButton
            component={Link}
            to={`/people/contacts/${contact?.partyId}`}
          >
            <ExternalLinkIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}
      </Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 3,
          pr: 2,
          py: 1.5,
          borderWidth: '1px 0',
          borderStyle: 'solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          <>
            {t('common:guardian')}{' '}
            <Box component="span" fontWeight={600}>
              {contactIndex + 1}/{data?.contacts?.length}
            </Box>
          </>
        </Typography>
        <Tooltip
          title={
            isLoading || numberOfContacts <= 1
              ? t('people:nextContactDisabled', { count: numberOfContacts })
              : ''
          }
        >
          <span>
            <Button
              disabled={isLoading || numberOfContacts <= 1}
              onClick={nextContact}
              endIcon={<ChevronRightIcon />}
              size="small"
            >
              {t('people:nextContact')}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <AnimatePresence initial={false}>
        <Box
          component={m.div}
          key={contact?.partyId}
          initial={{ x: '100%', position: 'absolute' }}
          animate={{ x: '0%', position: 'relative' }}
          exit={{ x: '-100%', position: 'absolute' }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
          sx={{
            width: '100%',
          }}
        >
          <Box sx={{ px: 3, py: 2 }}>
            <Stack direction="row" spacing={2}>
              <Avatar
                name={`${contact?.person?.firstName ?? ''} ${
                  contact?.person?.lastName ?? ''
                }`}
                src={contact?.person?.avatarUrl ?? undefined}
                sx={{ width: 62, height: 62, fontSize: 20 }}
              />

              <Stack>
                <Typography variant="h6">
                  {contact?.person?.firstName} {contact?.person?.lastName}
                </Typography>

                <Box
                  component="dl"
                  sx={{
                    m: 0,
                    mt: 0.5,
                    display: 'grid',
                    gridTemplateColumns: 'min-content auto',
                    gridColumnGap: 8,
                  }}
                >
                  <Box component="dt" sx={{ color: 'slate.600' }}>
                    {t('common:relationship')}
                  </Box>
                  <Box component="dd" sx={{ m: 0 }}>
                    {contactsRelationshipType
                      ? t(`common:relationshipType.${contactsRelationshipType}`)
                      : '-'}
                  </Box>
                  <Box component="dt" sx={{ color: 'slate.600' }}>
                    {t('common:language')}
                  </Box>
                  <Box component="dd" sx={{ m: 0 }}>
                    -
                  </Box>
                </Box>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
              <Button
                variant="contained"
                sx={{ flex: 1 }}
                onClick={() => console.log('open send sms modal')}
              >
                SMS
              </Button>
              <Button
                variant="contained"
                sx={{ flex: 1 }}
                onClick={() => console.log('open send mail popup')}
              >
                {t('mail:sendMail')}
              </Button>
            </Stack>
            <Box
              component="dl"
              sx={{
                m: 0,
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'min-content auto',
                  gridColumnGap: 16,
                  gridRowGap: 4,
                }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <PhoneIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Box component="dt" sx={{ color: 'slate.600' }}>
                    {t('common:phone')}
                  </Box>
                </Stack>
                <Box component="dd" sx={{ m: 0 }}>
                  {contact?.personalInformation?.primaryPhoneNumber?.number ??
                    '-'}
                </Box>

                <Stack direction="row" spacing={0.75} alignItems="center">
                  <MailIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Box component="dt" sx={{ color: 'slate.600' }}>
                    {t('common:email')}
                  </Box>
                </Stack>
                <Box component="dd" sx={{ m: 0 }}>
                  {contact?.personalInformation?.primaryEmail?.email ?? '-'}
                </Box>
              </Box>

              <Stack>
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  mt={2}
                >
                  <HouseLocationIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Box component="dt" sx={{ color: 'slate.600' }}>
                    {t('people:addressLocation')}
                  </Box>
                </Stack>
                <Box component="dd" sx={{ m: 0 }}>
                  {joinAddress(contact?.personalInformation?.primaryAddress)}
                </Box>

                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  mt={2}
                >
                  <LabelsIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Box component="dt" sx={{ color: 'slate.600' }}>
                    {t('common:groups')}
                  </Box>
                </Stack>
                <Box component="dd" sx={{ m: 0 }}>
                  -
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </AnimatePresence>
    </Card>
  );
}