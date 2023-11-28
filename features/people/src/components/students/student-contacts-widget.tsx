import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { AnimatePresence, m, Variants, wrap } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FullScreenIcon,
  HouseLocationIcon,
  MailIcon,
  PhoneIcon,
} from '@tyro/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';
import {
  Avatar,
  usePreferredNameLayout,
  formatPhoneNumber,
  ActionMenu,
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { SearchType, SmsRecipientType } from '@tyro/api';
import { useMailSettings } from '@tyro/mail';
import { useStudentsContacts } from '../../api/student/overview';
import { joinAddress } from '../../utils/join-address';

interface StudentContactsWidgetProps {
  studentId: number | undefined;
}

const animationVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 'calc(100% + 24px)' : 'calc(-100% - 24px)',
    position: 'absolute',
  }),
  center: {
    x: '0%',
    position: 'relative',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 'calc(-100% - 24px)' : 'calc(100% + 24px)',
    position: 'absolute',
  }),
};

export function StudentContactsWidget({
  studentId,
}: StudentContactsWidgetProps) {
  const [[contactIndex, direction], setContactIndex] = useState([0, 0]);
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();
  const [contactToSendSmsTo, setContactToSendSmsTo] =
    useState<RecipientsForSmsModal>([]);
  const { composeEmail } = useMailSettings();
  const { data: contacts, isLoading } = useStudentsContacts(studentId);

  const contactsAllowedToContact = contacts
    ?.filter((contact) => contact.allowedToContact)
    .sort((a, b) => (a.priority ?? 5) - (b.priority ?? 5));

  const numberOfContacts = contactsAllowedToContact?.length ?? 0;
  const clampedIndex = wrap(0, numberOfContacts, contactIndex);

  const selectedContact = contactsAllowedToContact?.[clampedIndex];

  const isButtonsDisabled = isLoading || numberOfContacts <= 1;
  const buttonTooltipTitle = isButtonsDisabled
    ? t('people:nextContactDisabled', { count: numberOfContacts })
    : '';
  const contactsRelationshipType = selectedContact?.relationshipType;

  const paginate = (newDirection: number) => {
    setContactIndex([contactIndex + newDirection, newDirection]);
  };

  const paginateToIndex = (index: number) => {
    setContactIndex([index, index > contactIndex ? 1 : -1]);
  };

  const menuItems =
    contactsAllowedToContact?.map((contact, index) => ({
      label: displayName(contact?.person),
      onClick: () => paginateToIndex(index),
    })) ?? [];

  const contactsDetails = [
    {
      label: t('common:phone'),
      icon: PhoneIcon,
      value: formatPhoneNumber(
        selectedContact?.personalInformation?.primaryPhoneNumber
      ),
    },
    {
      label: t('common:email'),
      icon: MailIcon,
      value: selectedContact?.personalInformation?.primaryEmail?.email ?? '-',
    },
    {
      label: t('common:address'),
      icon: HouseLocationIcon,
      value: joinAddress(selectedContact?.personalInformation?.primaryAddress, {
        emptyValue: '-',
      }) as string,
    },
  ] as const;

  return (
    <>
      <Card variant="soft" sx={{ flex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pl={1}
          mb={1}
        >
          <Typography variant="h6" component="span">
            {t('people:contactInformation')}
          </Typography>
          <IconButton
            component={Link}
            to={`/people/contacts/${selectedContact?.partyId ?? 0}`}
          >
            <FullScreenIcon
              sx={{ width: 20, height: 20, color: 'primary.main' }}
            />
          </IconButton>
        </Stack>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tooltip title={buttonTooltipTitle}>
            <span>
              <IconButton
                size="small"
                color="primary"
                disabled={isButtonsDisabled}
                onClick={() => paginate(-1)}
              >
                <ChevronLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
          <ActionMenu
            buttonLabel={t('people:contactXOfY', {
              index: clampedIndex + 1,
              total: numberOfContacts,
            })}
            buttonProps={{
              size: 'small',
              disabled: isButtonsDisabled,
            }}
            menuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            }}
            menuItems={menuItems}
          />

          <Tooltip title={buttonTooltipTitle}>
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

        <Box position="relative">
          <AnimatePresence initial={false} custom={direction}>
            <Card
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
              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    name={displayName(selectedContact?.person)}
                    src={selectedContact?.person?.avatarUrl}
                    sx={{ width: 62, height: 62, fontSize: 20 }}
                  />

                  <Stack>
                    <Typography variant="h6">
                      {displayName(selectedContact?.person)}
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
                      !selectedContact?.includeInSms &&
                      t('sms:recipientNotIncludedInSms', { count: 1 })
                    }
                  >
                    <Box display="flex" flex="1">
                      <Button
                        variant="soft"
                        sx={{ flex: 1 }}
                        disabled={!selectedContact?.includeInSms}
                        onClick={() =>
                          setContactToSendSmsTo([
                            {
                              id: selectedContact?.partyId ?? 0,
                              name: displayName(selectedContact?.person),
                              type: 'individual',
                              avatarUrl: selectedContact?.person?.avatarUrl,
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
                    onClick={() =>
                      composeEmail({
                        toRecipients: [
                          {
                            partyId: selectedContact?.partyId ?? 0,
                            text: displayName(selectedContact?.person),
                            type: SearchType.Contact,
                            avatarUrl: selectedContact?.person?.avatarUrl,
                          },
                        ],
                      })
                    }
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
                  <Stack spacing={1}>
                    {contactsDetails.map(({ label, icon: Icon, value }) => (
                      <Stack
                        direction="row"
                        spacing={1}
                        aria-label={`${label}: ${value}`}
                        alignItems="center"
                        key={label}
                      >
                        <Icon
                          sx={{ color: 'slate.400', width: 20, height: 20 }}
                        />
                        <Box component="span">{value}</Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Card>
          </AnimatePresence>
        </Box>
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
