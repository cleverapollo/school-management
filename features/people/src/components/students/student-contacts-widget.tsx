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
  MailIcon,
  PhoneIcon,
} from '@tyro/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { SmsRecipientType } from '@tyro/api';
import { useStudentsContacts } from '../../api/student/overview';

interface StudentContactsWidgetProps {
  studentId: number | undefined;
}

export function StudentContactsWidget({
  studentId,
}: StudentContactsWidgetProps) {
  const [contactIndex, setContactIndex] = useState(0);
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();
  const { data: contacts, isLoading } = useStudentsContacts(studentId);
  const [contactToSendSmsTo, setContactToSendSmsTo] =
    useState<RecipientsForSmsModal>([]);

  const numberOfContacts = contacts?.length ?? 0;
  const contact = contacts?.[contactIndex];
  const contactsRelationshipType =
    contact?.relationships?.[0]?.relationshipType;

  const nextContact = () => {
    const nextContactIndex =
      contactIndex + 1 >= numberOfContacts ? 0 : contactIndex + 1;
    setContactIndex(nextContactIndex);
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
        <CardHeader
          component="h3"
          title={t('people:contactInformation')}
          {...(contact?.partyId && {
            action: (
              <IconButton
                component={Link}
                to={`/people/contacts/${contact?.partyId}`}
              >
                <ExternalLinkIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            ),
          })}
        />
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            pl: 3,
            pr: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            <>
              {t('common:contact')}{' '}
              <Box component="span" fontWeight={600}>
                {contactIndex + 1}/{contacts?.length}
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
                  name={displayName(contact?.person)}
                  src={contact?.person?.avatarUrl}
                  sx={{ width: 62, height: 62, fontSize: 20 }}
                />

                <Stack>
                  <Typography variant="h6">
                    {displayName(contact?.person)}
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
                        ? t(
                            `common:relationshipType.${contactsRelationshipType}`
                          )
                        : '-'}
                    </Box>
                  </Box>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
                <Tooltip
                  describeChild
                  title={
                    !contact?.relationships?.[0]?.includeInSms &&
                    t('sms:recipientNotIncludedInSms', { count: 1 })
                  }
                >
                  <Box display="flex" flex="1">
                    <Button
                      variant="contained"
                      sx={{ flex: 1 }}
                      disabled={!contact?.relationships?.[0]?.includeInSms}
                      onClick={() =>
                        setContactToSendSmsTo([
                          {
                            id: contact?.partyId ?? 0,
                            name: displayName(contact?.person),
                            type: 'individual',
                            avatarUrl: contact?.person?.avatarUrl,
                          },
                        ])
                      }
                    >
                      SMS
                    </Button>
                  </Box>
                </Tooltip>
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
              </Box>
            </Box>
          </Box>
        </AnimatePresence>
      </Card>
      <SendSmsModal
        isOpen={contactToSendSmsTo.length > 0}
        onClose={() => setContactToSendSmsTo([])}
        recipients={contactToSendSmsTo}
        hideRecipientTypes
        possibleRecipientTypes={[
          {
            label: '',
            type: SmsRecipientType.Contact,
          },
        ]}
      />
    </>
  );
}
