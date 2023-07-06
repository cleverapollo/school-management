import { useState } from 'react';
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
import {
  UseQueryReturnType,
  UpsertStudentMedicalConditionInput,
} from '@tyro/api';
import { AnimatePresence, m, Variants, wrap } from 'framer-motion';
import {
  SendMailIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
  LocationIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout, formatPhoneNumber } from '@tyro/core';
import { Link } from 'react-router-dom';
import { useStudentMedical } from '../../../api/student/medical';

export type EditConditionsFormState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment'
> & {
  active?: boolean;
};

type StudentContactsWidgetProps = {
  studentId: number | undefined;
};

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

export function MedicalProfessionalWidget({
  studentId,
}: StudentContactsWidgetProps) {
  const [[contactIndex, direction], setContactIndex] = useState([0, 0]);
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();

  const { data: medicalData, isLoading } = useStudentMedical(studentId ?? 0);

  const numberOfContacts = medicalData?.medicalContacts?.length ?? 0;
  const clampedIndex = wrap(0, numberOfContacts, contactIndex);
  const medicalContact = medicalData?.medicalContacts?.[clampedIndex];
  const isButtonsDisabled = isLoading || numberOfContacts <= 1;
  const buttonTooltipTitle = isButtonsDisabled
    ? t('people:nextContactDisabled', { count: numberOfContacts })
    : '';

  const paginate = (newDirection: number) => {
    setContactIndex([contactIndex + newDirection, newDirection]);
  };

  console.log(medicalData, 'MedicalProfessionalWidget');
  console.log(medicalContact, 'contact');

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader component="h3" title="Medical professional" />
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
        <Box sx={{ flex: 1, overflowX: 'hidden' }}>
          <Typography
            component="h4"
            variant="subtitle2"
            noWrap
            px={2}
            textOverflow="ellipsis"
            textAlign="center"
          >
            {t('common:contact')}{' '}
            <Box component="span" fontWeight={600}>
              {clampedIndex + 1}/{medicalData?.medicalContacts?.length}
            </Box>
          </Typography>
        </Box>

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
          <Box sx={{ px: 3, py: 1 }}>
            {/* Avatar, name, title */}
            <Stack direction="row" spacing={2} sx={{ py: 1 }}>
              <Avatar
                name={displayName(medicalContact)}
                sx={{ width: 62, height: 62, fontSize: 20 }}
              />
              <Stack>
                <Typography variant="h6">
                  {medicalContact?.personalTitle} {displayName(medicalContact)}
                </Typography>
                <Typography variant="body1" sx={{ color: 'slate.600' }}>
                  {medicalContact?.occupation}
                </Typography>
              </Stack>
            </Stack>
            {/* Address */}
            <Stack direction="row" spacing={2} sx={{ py: 1 }}>
              <LocationIcon
                sx={{ color: 'slate.400', width: 20, height: 20 }}
              />
              <Stack>
                <Typography variant="body2" sx={{ color: 'slate.800' }}>
                  {medicalContact?.addressLine1},{medicalContact?.addressLine2},
                  {medicalContact?.addressLine3},{medicalContact?.county},
                  {medicalContact?.postcode}
                </Typography>
              </Stack>
            </Stack>
            {/* Phone */}
            <Stack direction="row" spacing={2} sx={{ py: 1 }}>
              <PhoneIcon sx={{ color: 'slate.400', width: 20, height: 20 }} />
              <Stack>
                <Typography variant="body2" sx={{ color: 'slate.800' }}>
                  {medicalContact?.primaryPhone}
                </Typography>
              </Stack>
            </Stack>
            {/* Email */}
            <Stack direction="row" spacing={2} sx={{ py: 1 }}>
              <MailIcon sx={{ color: 'slate.400', width: 20, height: 20 }} />
              <Stack>
                <Typography variant="body2" sx={{ color: 'slate.800' }}>
                  {medicalContact?.email}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </AnimatePresence>
    </Card>
  );
}
