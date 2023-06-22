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
import { AnimatePresence, m, Variants, wrap } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
} from '@tyro/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout, formatPhoneNumber } from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { SmsRecipientType } from '@tyro/api';
import { useStudentsContacts } from '../../api/student/overview';

interface StudentContactsWidgetProps {
  studentId: number | undefined;
}

const animationVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    position: 'absolute',
  }),
  center: {
    x: '0%',
    position: 'relative',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    position: 'absolute',
  }),
};

export function StudentContactsWidget({
  studentId,
}: StudentContactsWidgetProps) {
  const [[contactIndex, direction], setContactIndex] = useState([0, 0]);
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();
  const { data: contacts, isLoading } = useStudentsContacts(studentId);
  const [contactToSendSmsTo, setContactToSendSmsTo] =
    useState<RecipientsForSmsModal>([]);

  const numberOfContacts = contacts?.length ?? 0;
  const clampedIndex = wrap(0, numberOfContacts, contactIndex);
  const isButtonsDisabled = isLoading || numberOfContacts <= 1;
  const contact = contacts?.[clampedIndex];
  const contactsRelationshipType =
    contact?.relationships?.[0]?.relationshipType;

  const paginate = (newDirection: number) => {
    setContactIndex([contactIndex + newDirection, newDirection]);
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
            px: 2,
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tooltip
            title={
              isButtonsDisabled
                ? t('people:nextContactDisabled', { count: numberOfContacts })
                : ''
            }
          >
            <span>
              <IconButton
                size="small"
                color="primary"
                onClick={() => paginate(-1)}
              >
                <ChevronLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Box sx={{ flex: 1, overflowX: 'hidden' }}>
            <Typography
              component="h4"
              variant="subtitle2"
              noWrap
              sx={{ px: 2, textOverflow: 'ellipsis', textAlign: 'center' }}
            >
              {t('common:contact')}{' '}
              <Box component="span" fontWeight={600}>
                {clampedIndex + 1}/{contacts?.length}
              </Box>
            </Typography>
          </Box>

          <Tooltip
            title={
              isButtonsDisabled
                ? t('people:nextContactDisabled', { count: numberOfContacts })
                : ''
            }
          >
            <span>
              <IconButton
                size="small"
                color="primary"
                disabled={isButtonsDisabled}
                onClick={() => paginate(1)}
              >
                <ChevronRightIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <AnimatePresence initial={false} custom={direction}>
          <Box
            component={m.div}
            key={contactIndex}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={animationVariants}
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
                    {formatPhoneNumber(
                      contact?.personalInformation?.primaryPhoneNumber
                    )}
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
